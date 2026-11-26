'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Maximize2,
  Play,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Badge} from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type {MediaAsset} from '@/lib/admin/types';
import {DisclosurePanel} from './admin-components';
import {cn} from '@/lib/utils';

function useAssetUrl(asset: MediaAsset) {
  const [url, setUrl] = useState(asset.src || '');
  useEffect(() => {
    if (!asset.file) {
      setUrl(asset.src || '');
      return;
    }
    const objectUrl = URL.createObjectURL(asset.file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [asset.file, asset.src]);
  return url;
}

export function AssetVisual({
  asset,
  expanded = false,
}: {
  asset: MediaAsset;
  expanded?: boolean;
}) {
  const src = useAssetUrl(asset);
  const t = useTranslations('admin.cms');
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <p className="p-4 text-center text-sm text-muted-foreground">
        {t('mediaError')}
      </p>
    );
  if (!src)
    return (
      <div className="min-h-20" role="status">
        {t('loading')}
      </div>
    );
  if (asset.type === 'video')
    return (
      <video
        src={src}
        aria-label={asset.alt || asset.name}
        controls={expanded}
        muted={!expanded}
        playsInline
        preload="metadata"
        className={cn(
          'h-full w-full object-contain',
          expanded && 'max-h-[65dvh]',
        )}
        onError={() => setFailed(true)}
      />
    );
  // Browser object URLs and imported static paths are intentionally rendered directly.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={asset.alt || asset.name}
      loading={expanded ? 'eager' : 'lazy'}
      className={cn(
        'h-full w-full object-contain',
        expanded && 'max-h-[65dvh]',
      )}
      onError={() => setFailed(true)}
    />
  );
}

export function AssetPreview({
  asset,
  children,
  className,
}: {
  asset: MediaAsset;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations('admin.cms');
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t('expand')}: ${asset.name}`}
        className={cn(
          'group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <AssetVisual asset={asset} />
        <span className="absolute bottom-2 end-2 flex size-8 items-center justify-center rounded-md bg-foreground/80 text-white">
          <Maximize2 aria-hidden className="size-4" />
        </span>
        {asset.type === 'video' && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-md bg-black/60 p-3 text-white">
              <Play aria-hidden className="size-5" />
            </span>
          </span>
        )}
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeLabel={t('close')}
          className="max-h-[95dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-md"
        >
          <DialogHeader className="pe-10">
            <DialogTitle className="break-all leading-6">
              {asset.name}
            </DialogTitle>
            <DialogDescription>
              {asset.caption || asset.alt || t('preview')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-md bg-muted">
            <AssetVisual asset={asset} expanded />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MediaTile({
  asset,
  coverId,
  index,
  count,
  readOnly,
  onChange,
  onRemove,
  onCover,
  onMove,
}: {
  asset: MediaAsset;
  coverId: string;
  index: number;
  count: number;
  readOnly: boolean;
  onChange: (asset: MediaAsset) => void;
  onRemove: () => void;
  onCover: () => void;
  onMove: (delta: number) => void;
}) {
  const t = useTranslations('admin.cms');
  const id = useId();
  return (
    <div className="min-w-0 space-y-3 rounded-md border border-border bg-card p-3">
      <AssetPreview asset={asset}>
        {coverId === asset.id && (
          <Badge className="absolute start-2 top-2 bg-primary text-primary-foreground">
            <Check aria-hidden className="me-1 size-3" />
            {t('cover')}
          </Badge>
        )}
      </AssetPreview>
      <p className="truncate text-sm font-medium" title={asset.name}>
        {asset.name}
      </p>
      {readOnly ? (
        <>
          {asset.alt && (
            <p className="break-words text-sm text-muted-foreground">
              {t('alt')}: {asset.alt}
            </p>
          )}
          {asset.caption && (
            <p className="break-words text-sm text-muted-foreground">
              {asset.caption}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${id}-alt`} className="text-sm">
              {t('alt')}
            </Label>
            <Input
              id={`${id}-alt`}
              value={asset.alt}
              onChange={(e) => onChange({...asset, alt: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${id}-caption`} className="text-sm">
              {t('caption')}
            </Label>
            <Input
              id={`${id}-caption`}
              value={asset.caption}
              onChange={(e) => onChange({...asset, caption: e.target.value})}
            />
          </div>
          <div className="flex flex-wrap gap-1 border-t border-border pt-3">
            {asset.type === 'image' && (
              <Button
                type="button"
                variant={coverId === asset.id ? 'secondary' : 'outline'}
                className="flex-1 px-2 text-sm"
                onClick={onCover}
              >
                {coverId === asset.id ? (
                  <Check aria-hidden />
                ) : (
                  <ImagePlus aria-hidden />
                )}
                {coverId === asset.id ? t('cover') : t('setCover')}
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`${t('moveEarlier')}: ${asset.name}`}
              disabled={index === 0}
              onClick={() => onMove(-1)}
            >
              <ChevronUp aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`${t('moveLater')}: ${asset.name}`}
              disabled={index === count - 1}
              onClick={() => onMove(1)}
            >
              <ChevronDown aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              aria-label={`${t('removeAsset')}: ${asset.name}`}
              onClick={onRemove}
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export function MediaManager({
  assets,
  coverId,
  onChange,
  readOnly = false,
}: {
  assets: MediaAsset[];
  coverId: string;
  onChange?: (assets: MediaAsset[], coverId: string) => void;
  readOnly?: boolean;
}) {
  const t = useTranslations('admin.cms');
  const [errors, setErrors] = useState<string[]>([]);
  const cover = assets.find((asset) => asset.id === coverId);
  const latest = useRef({assets, coverId});
  latest.current = {assets, coverId};
  function upload(files: FileList | File[], type: 'image' | 'video') {
    const valid: MediaAsset[] = [];
    const problems: string[] = [];
    for (const file of Array.from(files)) {
      const supported =
        type === 'image'
          ? /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name) &&
            file.type.startsWith('image/')
          : /\.(mp4|webm|ogv)$/i.test(file.name) &&
            file.type.startsWith('video/');
      if (!supported) {
        problems.push(t('unsupportedFile', {name: file.name}));
        continue;
      }
      if (!file.size) {
        problems.push(t('emptyFile', {name: file.name}));
        continue;
      }
      valid.push({
        id: crypto.randomUUID(),
        type,
        name: file.name,
        file,
        alt: file.name.replace(/\.[^.]+$/, ''),
        caption: '',
      });
    }
    setErrors(problems);
    if (valid.length) {
      const current = latest.current;
      onChange?.(
        [...current.assets, ...valid],
        current.coverId ||
          valid.find((asset) => asset.type === 'image')?.id ||
          '',
      );
    }
  }
  function remove(id: string) {
    const next = assets.filter((asset) => asset.id !== id);
    onChange?.(
      next,
      coverId === id
        ? next.find((asset) => asset.type === 'image')?.id || ''
        : coverId,
    );
  }
  function move(index: number, delta: number) {
    const next = [...assets];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange?.(next, coverId);
  }
  return (
    <div className="space-y-4">
      <DisclosurePanel title={t('cover')} hint={t('coverHint')} defaultOpen>
        <div className="max-w-sm">
          {cover ? (
            <AssetPreview asset={cover} />
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-md border border-dashed border-border bg-muted text-sm text-muted-foreground">
              <ImagePlus aria-hidden className="me-2 size-5" />
              {t('noCover')}
            </div>
          )}
        </div>
      </DisclosurePanel>
      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded-md border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {(['image', 'video'] as const).map((type) => {
        const items = assets.filter((asset) => asset.type === type);
        return (
          <DisclosurePanel
            key={type}
            title={t(type === 'image' ? 'images' : 'videos')}
            count={items.length}
            defaultOpen={readOnly && items.length > 0}
          >
            {!readOnly && (
              <UploadArea
                type={type}
                onUpload={(files) => upload(files, type)}
              />
            )}
            {items.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {items.map((asset) => (
                  <MediaTile
                    key={asset.id}
                    asset={asset}
                    coverId={coverId}
                    index={assets.indexOf(asset)}
                    count={assets.length}
                    readOnly={readOnly}
                    onChange={(value) =>
                      onChange?.(
                        assets.map((item) =>
                          item.id === value.id ? value : item,
                        ),
                        coverId,
                      )
                    }
                    onRemove={() => remove(asset.id)}
                    onCover={() => onChange?.(assets, asset.id)}
                    onMove={(delta) => move(assets.indexOf(asset), delta)}
                  />
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t('noMedia')}
              </p>
            )}
          </DisclosurePanel>
        );
      })}
    </div>
  );
}

function UploadArea({
  type,
  onUpload,
}: {
  type: 'image' | 'video';
  onUpload: (files: FileList) => void;
}) {
  const t = useTranslations('admin.cms');
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const label = t(type === 'image' ? 'uploadImages' : 'uploadVideos');
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-md border-2 border-dashed border-border bg-muted/40 px-4 py-7 text-center',
        dragging && 'border-primary bg-secondary',
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        onUpload(event.dataTransfer.files);
      }}
    >
      <div className="mb-3 rounded-md border border-border bg-white p-3 text-primary">
        {type === 'image' ? (
          <ImagePlus aria-hidden className="size-6" />
        ) : (
          <Video aria-hidden className="size-6" />
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => input.current?.click()}
      >
        <Upload aria-hidden />
        {label}
      </Button>
      <input
        ref={input}
        type="file"
        multiple
        accept={
          type === 'image'
            ? '.jpg,.jpeg,.png,.webp,.gif,.avif'
            : '.mp4,.webm,.ogv'
        }
        className="sr-only"
        aria-label={label}
        tabIndex={-1}
        onChange={(event) => {
          if (event.target.files) onUpload(event.target.files);
          event.target.value = '';
        }}
      />
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {t('uploadHint')}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(type === 'image' ? 'imageFormats' : 'videoFormats')}
      </p>
    </div>
  );
}
