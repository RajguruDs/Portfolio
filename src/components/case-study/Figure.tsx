import { useEffect, useRef, useState, type ReactNode } from "react";
import { ExternalLink, Maximize2, MousePointerClick, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ImageAsset = { src: string; width: number; height: number };

type ImageFigureProps = ImageAsset & {
  alt: string;
  caption: ReactNode;
  /** Short label for the enlarge button and dialog title, e.g. "ROC curve". */
  label?: string;
  /** Higher-resolution or uncropped version shown in the lightbox. */
  zoom?: ImageAsset;
  /** Load immediately (above-the-fold covers). */
  priority?: boolean;
  /** Where the image comes from, shown before the caption. */
  source?: string;
  /** Cap the rendered width at the file's natural width so small plots aren't upscaled. */
  natural?: boolean;
  className?: string;
};

/** A captioned figure. Click or press Enter on the image to open it full size. */
export const ImageFigure = ({
  src,
  width,
  height,
  alt,
  caption,
  label,
  zoom,
  priority,
  source,
  natural,
  className,
}: ImageFigureProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const big = zoom ?? { src, width, height };
  const name = label ?? "figure";

  return (
    <figure className={cn("min-w-0 rounded-md border border-rule bg-surface p-3 shadow-[0_1px_2px_rgba(22,24,29,0.04)] sm:p-4", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-sm bg-white"
        aria-label={`Enlarge ${name}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchpriority: "high" } : {})}
          className="mx-auto h-auto w-full"
          style={natural ? { maxWidth: `${width}px` } : undefined}
        />
        <span
          aria-hidden="true"
          className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-sm border border-rule px-2 py-1 text-xs font-medium text-ink-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ backgroundColor: "color-mix(in srgb, var(--surface) 94%, transparent)" }}
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Enlarge
        </span>
      </button>
      <figcaption className="mt-3 border-t border-rule px-1 pt-3 text-[0.8125rem] leading-relaxed text-ink-3">
        {source && <span className="mr-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-2">{source} ·</span>}
        {caption}
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={name}
        onClose={() => triggerRef.current?.focus()}
        className="lightbox m-auto max-h-[94vh] w-[min(96vw,1400px)] max-w-none overflow-hidden rounded-md border border-rule bg-surface p-0 text-ink shadow-2xl"
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself, outside its content) closes it.
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="flex max-h-[94vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5">
            <p className="truncate text-sm font-medium text-ink">{label ?? alt}</p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-ink-2 hover:bg-sunken hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-white p-2 sm:p-4">
            <img src={big.src} alt={alt} width={big.width} height={big.height} loading="lazy" decoding="async" className="mx-auto h-auto max-w-full" />
          </div>
          <p className="border-t border-rule px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-3">{caption}</p>
        </div>
      </dialog>
    </figure>
  );
};

/** Two or three related figures side by side (small multiples), stacking on narrow screens. */
export const FigureGrid = ({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) => (
  <div className={cn("grid gap-4", columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>{children}</div>
);

type TableauEmbedProps = {
  title: string;
  /** Public Tableau view URL, e.g. https://public.tableau.com/views/<Workbook>/<View> */
  viewUrl: string;
  poster: ImageAsset;
  posterAlt: string;
  caption: ReactNode;
  /** The workbook's fixed dashboard size in CSS pixels, so the live view can be scaled to fit. */
  vizSize: { width: number; height: number };
};

/** Scales a fixed-size child down to the width of its container (to a floor of 50%). */
const useFitScale = (naturalWidth: number, active: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    // Never shrink below half size — on phones the dialog scrolls sideways instead of becoming unreadable.
    const update = () => setScale(Math.max(0.5, Math.min(1, el.clientWidth / naturalWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [naturalWidth, active]);
  return { ref, scale };
};

/**
 * Shows a real screenshot of a Tableau Public dashboard inline. The live, interactive view
 * opens in a large dialog — Tableau dashboards have a fixed layout that is too wide for the
 * text column — and is only requested when the visitor asks for it.
 */
export const TableauEmbed = ({ title, viewUrl, poster, posterAlt, caption, vizSize }: TableauEmbedProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { ref: fitRef, scale } = useFitScale(vizSize.width, open);
  const embedUrl = `${viewUrl}?:showVizHome=no&:embed=true&:toolbar=yes`;

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };

  return (
    <figure className="min-w-0 rounded-md border border-rule bg-surface p-3 shadow-[0_1px_2px_rgba(22,24,29,0.04)] sm:p-4">
      <div className="relative overflow-hidden rounded-sm bg-white">
        <img src={poster.src} alt={posterAlt} width={poster.width} height={poster.height} loading="lazy" decoding="async" className="h-auto w-full" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[rgba(22,24,29,0.42)] to-transparent p-4 pt-16">
          <button ref={triggerRef} type="button" onClick={show} className="btn-primary shadow-lg">
            <MousePointerClick className="h-4 w-4" aria-hidden="true" />
            Explore the live dashboard
          </button>
        </div>
      </div>
      <figcaption className="mt-3 flex flex-col gap-3 border-t border-rule px-1 pt-3 text-[0.8125rem] leading-relaxed text-ink-3 sm:flex-row sm:items-start sm:justify-between">
        <span>
          <span className="mr-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-2">Tableau Public ·</span>
          {caption}
        </span>
        <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="action-link shrink-0">
          Open on Tableau Public
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </figcaption>

      <dialog
        ref={dialogRef}
        aria-label={title}
        onClose={() => triggerRef.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        className="lightbox m-auto h-[94vh] w-[min(96vw,1800px)] max-w-none overflow-hidden rounded-md border border-rule bg-surface p-0 text-ink shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5">
            <p className="truncate text-sm font-medium text-ink">{title}</p>
            <div className="flex shrink-0 items-center gap-2">
              <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="action-link hidden sm:inline-flex">
                Open in a new tab
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex h-9 w-9 items-center justify-center rounded text-ink-2 hover:bg-sunken hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div ref={fitRef} className="min-h-0 flex-1 overflow-auto bg-white">
            {open && (
              <div style={{ width: vizSize.width * scale, height: vizSize.height * scale }} className="mx-auto">
                <iframe
                  src={embedUrl}
                  title={title}
                  width={vizSize.width}
                  height={vizSize.height}
                  className="border-0"
                  style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </dialog>
    </figure>
  );
};
