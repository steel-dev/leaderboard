import { useEffect, useRef } from "react";
import { sizeDescriptions, sizeLabels, sizes, type ModelSize } from "../lib/model-classification";

export default function ModelSizePicker({
  selected,
  onChange,
}: {
  selected: ModelSize[];
  onChange: (sizes: ModelSize[]) => void;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const label = selected.length ? selected.map((size) => sizeLabels[size]).join(", ") : "All sizes";

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        menu.current?.open &&
        !menu.current.contains(event.target)
      ) {
        if (menu.current.contains(document.activeElement)) {
          menu.current.querySelector("summary")?.focus({ preventScroll: true });
        }
        menu.current.open = false;
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return (
    <div className="chart-size-control">
      <span className="sr-only">Model size</span>
      <details
        ref={menu}
        className="chart-size-picker"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) {
            event.preventDefault();
            event.stopPropagation();
            menu.current.open = false;
            menu.current.querySelector("summary")?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && menu.current) {
            menu.current.open = false;
          }
        }}
      >
        <summary aria-label={`Model size: ${label}`}>
          <span>{label}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </summary>
        <fieldset className="chart-size-menu">
          <legend className="sr-only">Choose model sizes</legend>
          <button type="button" onClick={() => onChange([])}>
            All sizes
          </button>
          {sizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={selected.includes(size)}
                onChange={() =>
                  onChange(
                    selected.includes(size)
                      ? selected.filter((item) => item !== size)
                      : sizes.filter((item) => item === size || selected.includes(item))
                  )
                }
              />
              <span>
                <strong>{sizeLabels[size]}</strong>
                <small>{sizeDescriptions[size]}</small>
              </span>
            </label>
          ))}
        </fieldset>
      </details>
    </div>
  );
}
