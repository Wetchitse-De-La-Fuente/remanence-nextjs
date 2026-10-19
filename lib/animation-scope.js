/** Ressources d'une animation : tout est libéré au démontage React. */
export function createAnimationScope() {
  const controller = new AbortController();
  const frames = new Set();
  const timers = new Set();
  const intervals = new Set();
  const disposers = [];
  // React Strict Mode rejoue les effets : restaurer les valeurs de départ.
  const snapshots = [...document.querySelectorAll('*')].map((element) => ({
    element,
    className: element.getAttribute('class'),
    style: element.getAttribute('style'),
    hidden: element.hasAttribute('hidden'),
  }));
  let active = true;
  const scope = {
    get active() {
      return active;
    },
    signal: controller.signal,
    guard(callback) {
      return (...args) => (active ? callback?.(...args) : undefined);
    },
    listen(target, type, callback, options) {
      target.addEventListener(type, callback, options);
      disposers.push(() => target.removeEventListener(type, callback, options));
    },
    frame(callback) {
      if (!active) return 0;
      const id = requestAnimationFrame((time) => {
        frames.delete(id);
        if (active) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelFrame(id) {
      cancelAnimationFrame(id);
      frames.delete(id);
    },
    timeout(callback, delay, ...args) {
      if (!active) return 0;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (active) callback(...args);
      }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) {
      window.clearTimeout(id);
      timers.delete(id);
    },
    interval(callback, delay, ...args) {
      if (!active) return 0;
      const id = window.setInterval(() => {
        if (active) callback(...args);
      }, delay);
      intervals.add(id);
      return id;
    },
    clearInterval(id) {
      window.clearInterval(id);
      intervals.delete(id);
    },
    observe(observer) {
      disposers.push(() => observer.disconnect());
      return observer;
    },
    onDispose(callback) {
      disposers.push(callback);
    },
    dispose() {
      if (!active) return;
      active = false;
      controller.abort();
      frames.forEach(cancelAnimationFrame);
      timers.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
      disposers.reverse().forEach((dispose) => dispose());
      for (const { element, className, style, hidden } of snapshots) {
        if (className === null) element.removeAttribute('class');
        else element.setAttribute('class', className);
        if (style === null) element.removeAttribute('style');
        else element.setAttribute('style', style);
        element.toggleAttribute('hidden', hidden);
      }
    },
  };
  return scope;
}
