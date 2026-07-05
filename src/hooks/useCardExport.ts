import { toPng } from 'html-to-image';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { TOP_PAGE_TEXT } from '@/constant/pages.constant';
import { loadGoogleFont } from '@/utils/loadGoogleFont';

export type ExportStatus = 'idle' | 'preparing' | 'rendering' | 'success' | 'error';

export interface UseCardExportOptions {
  targetRef: RefObject<HTMLElement | null>;
  width: number;
  height: number;
  fileName: string;
}

export interface UseCardExportReturn {
  status: ExportStatus;
  errorMessage: string | null;
  exportImage: () => Promise<void>;
}

const SUCCESS_RESET_MS = 1500;
const ERROR_RESET_MS = 3000;

const waitForImages = async (root: HTMLElement): Promise<void> => {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  await Promise.all(
    imgs.map((img) => {
      if (typeof img.decode === 'function') {
        return img.decode().catch(() => undefined);
      }
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  );
};

const collectFontFamilies = (root: HTMLElement): string[] => {
  const familyValues = new Set<string>();
  const rootFamily = getComputedStyle(root).fontFamily;
  if (rootFamily) familyValues.add(rootFamily);
  root.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const family = getComputedStyle(el).fontFamily;
    if (family) familyValues.add(family);
  });
  return Array.from(familyValues);
};

const waitForFonts = async (root: HTMLElement): Promise<void> => {
  const families = collectFontFamilies(root);
  await Promise.all(families.map((family) => loadGoogleFont(family)));
  await Promise.all(
    families.map((family) => {
      const firstFamily =
        family
          .split(',')[0]
          ?.trim()
          .replace(/^['"]|['"]$/g, '') ?? '';
      if (!firstFamily) return Promise.resolve();
      return document.fonts.load(`10px "${firstFamily}"`).catch(() => undefined);
    }),
  );
};

const waitTwoFrames = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const triggerDownload = (dataUrl: string, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};

export function useCardExport(opts: UseCardExportOptions): UseCardExportReturn {
  const { targetRef, width, height, fileName } = opts;
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const scheduleReset = useCallback((delayMs: number) => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setStatus('idle');
      setErrorMessage(null);
      resetTimerRef.current = null;
    }, delayMs);
  }, []);

  const exportImage = useCallback(async () => {
    if (status !== 'idle') return;
    const el = targetRef.current;
    if (!el) return;

    setErrorMessage(null);
    setStatus('preparing');
    try {
      await waitForImages(el);
      await waitForFonts(el);
      await waitTwoFrames();

      setStatus('rendering');
      const dataUrl = await toPng(el, {
        style: { transform: 'none', transformOrigin: 'top left' },
        width,
        height,
        pixelRatio: 2,
        cacheBust: false,
      });
      triggerDownload(dataUrl, fileName);

      setStatus('success');
      scheduleReset(SUCCESS_RESET_MS);
    } catch (error) {
      console.error(TOP_PAGE_TEXT.genImageErrorLog, error);
      setErrorMessage(TOP_PAGE_TEXT.exportErrorMessage);
      setStatus('error');
      scheduleReset(ERROR_RESET_MS);
    }
  }, [status, targetRef, width, height, fileName, scheduleReset]);

  return { status, errorMessage, exportImage };
}
