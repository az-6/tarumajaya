type Props = {
  address?: string
  lat?: number
  lng?: number
  height?: number
}

export default function MapEmbed({ address = "Jakarta, Indonesia", lat, lng, height = 300 }: Props) {
  const src = lat !== undefined && lng !== undefined
    ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`

  return (
    <div className="overflow-hidden rounded-lg border" style={{ height }}>
      <iframe
        title="Peta Lokasi"
        src={src}
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
