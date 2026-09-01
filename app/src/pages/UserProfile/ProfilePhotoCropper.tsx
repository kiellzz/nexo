import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'

interface ProfilePhotoCropperProps {
  value?: string
  fallbackText: string
  label: string
  onChange: (value?: string) => void
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(new Error('Não foi possível ler a imagem.')))
    reader.readAsDataURL(file)
  })
}

function createImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error('Não foi possível carregar a imagem.')))
    image.src = src
  })
}

async function cropImage(imageSrc: string, cropArea: Area) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Seu navegador não conseguiu preparar o corte da imagem.')
  }

  canvas.width = cropArea.width
  canvas.height = cropArea.height

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  )

  return canvas.toDataURL('image/jpeg', 0.9)
}

export function ProfilePhotoCropper({
  value,
  fallbackText,
  label,
  onChange,
}: ProfilePhotoCropperProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    setError(null)

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Escolha um arquivo de imagem.')
      return
    }

    try {
      setSourceImage(await readFileAsDataUrl(file))
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível abrir a imagem.')
    }
  }

  async function handleApplyCrop() {
    if (!sourceImage || !croppedArea) return

    try {
      onChange(await cropImage(sourceImage, croppedArea))
      setSourceImage(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cortar a imagem.')
    }
  }

  return (
    <div className="profile-photo-field">
      <div className="profile-photo-preview" aria-label={label}>
        {value ? (
          <img src={value} alt={label} />
        ) : (
          <span>{getInitials(fallbackText) || 'NX'}</span>
        )}
      </div>

      <div className="profile-photo-copy">
        <span>{label}</span>
        <p>Use uma imagem quadrada ou corte no círculo para deixar o perfil consistente no match.</p>
        <div className="profile-photo-actions">
          <button type="button" className="btn btn-secondary small" onClick={() => inputRef.current?.click()}>
            Escolher imagem
          </button>
          {value && (
            <button type="button" className="text-link" onClick={() => onChange(undefined)}>
              Remover
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        className="visually-hidden-file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {error && <p className="field-error profile-photo-error">{error}</p>}

      {sourceImage && (
        <div className="crop-modal-backdrop" role="presentation">
          <div className="crop-modal" role="dialog" aria-modal="true" aria-label="Cortar foto de perfil">
            <div className="crop-modal-header">
              <div>
                <span className="label-badge">Foto de perfil</span>
                <h3>Ajuste o enquadramento</h3>
              </div>
              <button
                type="button"
                className="legal-modal-close"
                onClick={() => setSourceImage(null)}
                aria-label="Fechar corte de imagem"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="cropper-stage">
              <Cropper
                image={sourceImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
              />
            </div>

            <label className="zoom-control">
              <span>Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>

            <div className="crop-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setSourceImage(null)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleApplyCrop}>
                Aplicar corte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
