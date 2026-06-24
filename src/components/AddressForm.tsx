"use client";
import { useState, useEffect } from "react";

interface AddressData {
  address: string;
  province: string;
  provinceId: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
  village: string;
  villageId: string;
  postalCode: string;
  biteshipAreaId: string;
}

interface Props {
  value: AddressData;
  onChange: (data: AddressData) => void;
  inputStyle: React.CSSProperties;
}

export default function AddressForm({ value, onChange, inputStyle }: Props) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [loadingBiteship, setLoadingBiteship] = useState(false);

  useEffect(() => {
    fetch("/api/wilayah?type=provinces")
      .then(r => r.json())
      .then(setProvinces)
      .catch(() => {});
  }, []);

  async function selectProvince(id: string, name: string) {
    onChange({ ...value, province: name, provinceId: id, city: "", cityId: "", district: "", districtId: "", village: "", villageId: "", postalCode: "", biteshipAreaId: "" });
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    setLoadingRegencies(true);
    try {
      const res = await fetch(`/api/wilayah?type=regencies&id=${id}`);
      setRegencies(await res.json());
    } catch {}
    finally { setLoadingRegencies(false); }
  }

  async function selectRegency(id: string, name: string) {
    onChange({ ...value, city: name, cityId: id, district: "", districtId: "", village: "", villageId: "", postalCode: "", biteshipAreaId: "" });
    setDistricts([]);
    setVillages([]);
    setLoadingDistricts(true);
    try {
      const res = await fetch(`/api/wilayah?type=districts&id=${id}`);
      setDistricts(await res.json());
    } catch {}
    finally { setLoadingDistricts(false); }
  }

  async function selectDistrict(id: string, name: string) {
    onChange({ ...value, district: name, districtId: id, village: "", villageId: "", postalCode: "", biteshipAreaId: "" });
    setVillages([]);
    setLoadingVillages(true);
    try {
      const res = await fetch(`/api/wilayah?type=villages&id=${id}`);
      setVillages(await res.json());
    } catch {}
    finally { setLoadingVillages(false); }
  }

  async function selectVillage(id: string, name: string) {
    setLoadingBiteship(true);
    onChange({ ...value, village: name, villageId: id, postalCode: "", biteshipAreaId: "" });
    try {
      const q = `${name} ${value.district} ${value.city}`;
      const res = await fetch("/api/biteship/locations?q=" + encodeURIComponent(q));
      const areas = await res.json();
      if (areas && areas.length > 0) {
        const area = areas[0];
        onChange({
          ...value,
          village: name,
          villageId: id,
          postalCode: String(area.postal_code || ""),
          biteshipAreaId: area.id,
        });
      }
    } catch {}
    finally { setLoadingBiteship(false); }
  }

  const sel = (disabled?: boolean): React.CSSProperties => ({
    ...inputStyle,
    appearance: "none" as any,
    WebkitAppearance: "none" as any,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239A8F82' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    color: "#1C1917",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Alamat Lengkap */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>Alamat Lengkap</p>
        <textarea
          required
          value={value.address}
          onChange={e => onChange({ ...value, address: e.target.value })}
          placeholder="Jalan, nomor rumah, RT/RW, patokan rumah..."
          rows={3}
          style={{ ...inputStyle, resize: "none", paddingTop: "14px" }}
        />
      </div>

      {/* Provinsi */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>Provinsi</p>
        <select
          required
          value={value.provinceId}
          onChange={e => {
            const opt = provinces.find(p => p.id === e.target.value);
            if (opt) selectProvince(opt.id, opt.name);
          }}
          style={sel()}
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Kota/Kabupaten */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>
          Kota / Kabupaten {loadingRegencies && <span style={{ color: "#B5935A" }}>...</span>}
        </p>
        <select
          required
          value={value.cityId}
          onChange={e => {
            const opt = regencies.find(r => r.id === e.target.value);
            if (opt) selectRegency(opt.id, opt.name);
          }}
          disabled={!value.provinceId || loadingRegencies}
          style={sel(!value.provinceId || loadingRegencies)}
        >
          <option value="">Pilih Kota/Kabupaten</option>
          {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {/* Kecamatan */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>
          Kecamatan {loadingDistricts && <span style={{ color: "#B5935A" }}>...</span>}
        </p>
        <select
          required
          value={value.districtId}
          onChange={e => {
            const opt = districts.find(d => d.id === e.target.value);
            if (opt) selectDistrict(opt.id, opt.name);
          }}
          disabled={!value.cityId || loadingDistricts}
          style={sel(!value.cityId || loadingDistricts)}
        >
          <option value="">Pilih Kecamatan</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Kelurahan */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>
          Kelurahan / Desa {loadingVillages && <span style={{ color: "#B5935A" }}>...</span>}
        </p>
        <select
          required
          value={value.villageId}
          onChange={e => {
            const opt = villages.find(v => v.id === e.target.value);
            if (opt) selectVillage(opt.id, opt.name);
          }}
          disabled={!value.districtId || loadingVillages}
          style={sel(!value.districtId || loadingVillages)}
        >
          <option value="">Pilih Kelurahan/Desa</option>
          {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      {/* Kode Pos */}
      <div>
        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#9A8F82", textTransform: "uppercase", marginBottom: "6px" }}>
          Kode Pos {loadingBiteship && <span style={{ color: "#B5935A" }}>Mengambil kode pos...</span>}
        </p>
        <input
          value={value.postalCode}
          onChange={e => onChange({ ...value, postalCode: e.target.value })}
          placeholder="Otomatis atau isi manual"
          style={{ ...inputStyle, background: value.postalCode ? "#F0EBE3" : "transparent" }}
        />
      </div>
    </div>
  );
}
