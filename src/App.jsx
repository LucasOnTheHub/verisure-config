import { useState, useMemo } from "react";
const INTEGRALE_PRODUITS = [
  { ref: "I1", label: "BAC®", prixMat: 199, abo: 5 },
  { ref: "I2", label: "Serrure", prixMat: 199, abo: 5 },
  { ref: "I3", label: "Aquila ext.", prixMat: 199, abo: 5 },
  { ref: "I4", label: "DF x2", prixMat: 199, abo: 5 },
  { ref: "I5", label: "Arlo FHD", prixMat: 199, abo: 5 },
];
const PACKS_PERIM = [
  { ref: "P1", label: "Bouclier", prixMat: 399, abo: 8 },
  { ref: "P2", label: "5 contacts", prixMat: 199, abo: 5 },
  { ref: "P3", label: "3 contacts", prixMat: 149, abo: 3 },
  { ref: "P4", label: "1 contact", prixMat: 59, abo: 1 },
];
const PACKS_VOL = [
  { ref: "V1", label: "2 Aquila", prixMat: 299, abo: 8 },
  { ref: "V2", label: "Orion+Aquila", prixMat: 299, abo: 8 },
  { ref: "V3", label: "2 Orion", prixMat: 199, abo: 5 },
  { ref: "V4", label: "1 Orion", prixMat: 119, abo: 3 },
];
const PACKS_ARLO = [
  { ref: "A1", label: "PRO 5", prixMat: 199, abo: 5 },
  { ref: "A2", label: "Doorbell", prixMat: 199, abo: 5 },
  { ref: "A3", label: "FHD", prixMat: 199, abo: 5 },
  { ref: "A4", label: "SmartHub", prixMat: 39, abo: 0 },
  { ref: "A5", label: "2 FHD", prixMat: 199, abo: 10 },
];
const EXTRAS = [
  { ref: "S1", label: "3 badges", prixMat: 29, abo: 0 },
  { ref: "S2", label: "Télécomm.", prixMat: 49, abo: 0 },
  { ref: "S3", label: "Btn panique", prixMat: 149, abo: 3 },
  { ref: "S4", label: "Détect. fumée", prixMat: 149, abo: 3 },
  { ref: "S5", label: "Lecteur badge", prixMat: 149, abo: 3 },
];
const REMISE_MAT_OPTIONS = [
  { value: 0, label: "Plein tarif" },
  { value: 25, label: "-25% MAT" },
  { value: 50, label: "-50% MAT" },
  { value: 100, label: "Offert" },
];
const REMISE_ABO_OPTIONS = [
  { value: 0, label: "Plein tarif" },
  { value: 50, label: "-50% ABO" },
  { value: 100, label: "Offert" },
];
function getCodeMAT(ref, pct) { if (pct === 0) return null; return `MAT${ref}${pct === 100 ? "OFF" : pct}`; }
function getCodeABO(ref, pct) { if (pct === 0) return null; return `ABO${ref}${pct === 100 ? "OFF" : pct}`; }
function calcMalusPack({ remiseMat, remiseAbo, abo, ref, isIntegrale, autreProduitIntegraleEnPleinTarif }) {
  const matOffert = remiseMat === 100, aboOffert = remiseAbo === 100;
  if (ref === "A5") { if (matOffert && !aboOffert) return -10; return 0; }
  if (isIntegrale) {
    if (matOffert && aboOffert) return autreProduitIntegraleEnPleinTarif ? -10 : -40;
    if (matOffert && abo >= 4 && !aboOffert) return autreProduitIntegraleEnPleinTarif ? -10 : -40;
    if (matOffert && !aboOffert) return -10;
    return 0;
  }
  if (matOffert && aboOffert) return -40;
  if (matOffert && abo >= 4 && !aboOffert) return -40;
  if (matOffert && !aboOffert) return -10;
  return 0;
}
function calcMalusABOXCA(n) { if (!n || n === 0) return 0; return -(10 + n * 5); }
const SEL = { background: "#0e0e1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#f0f0f0", padding: "6px 8px", fontSize: 12, width: "100%", cursor: "pointer" };
const pill = (active, accent = "#c0392b") => ({ padding: "7px 13px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none", background: active ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : "rgba(255,255,255,0.05)", color: active ? "#fff" : "#666", transition: "all 0.15s", whiteSpace: "nowrap" });
const lbl = { display: "flex", flexDirection: "column", gap: 5 };
const lblTxt = { fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 };
const chip = (bg) => ({ display: "inline-block", background: bg, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 4, padding: "2px 8px", letterSpacing: 0.5, fontFamily: "monospace" });

function PackConfig({ pack, config, onChange }) {
  const { remiseMat = 0, remiseAbo = 0 } = config;
  const codeMAT = getCodeMAT(pack.ref, remiseMat);
  const codeABO = getCodeABO(pack.ref, remiseAbo);
  const malus = calcMalusPack({ remiseMat, remiseAbo, abo: pack.abo });
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid #c0392b", borderRadius: "0 8px 8px 0", padding: "12px 14px", marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ background: "#8e1010", color: "#fff", fontWeight: 800, fontSize: 11, borderRadius: 4, padding: "2px 8px" }}>{pack.ref}</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{pack.label}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#444" }}>{pack.prixMat}€ HT{pack.abo > 0 ? ` · +${pack.abo}€/mois` : ""}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: pack.abo > 0 ? "1fr 1fr" : "1fr", gap: 10 }}>
        <div style={lbl}>
          <span style={lblTxt}>Remise matériel</span>
          <select value={remiseMat} onChange={e => onChange({ ...config, remiseMat: +e.target.value })} style={SEL}>
            {REMISE_MAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {codeMAT && <span style={chip("#8e1010")}>{codeMAT}</span>}
            <span style={{ fontSize: 11, color: "#f39c12" }}>{(pack.prixMat * (1 - remiseMat / 100)).toFixed(0)}€ HT</span>
          </div>
        </div>
        {pack.abo > 0 && (
          <div style={lbl}>
            <span style={lblTxt}>Remise abonnement</span>
            <select value={remiseAbo} onChange={e => onChange({ ...config, remiseAbo: +e.target.value })} style={SEL}>
              {REMISE_ABO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {codeABO && <span style={chip("#1a5276")}>{codeABO}</span>}
              <span style={{ fontSize: 11, color: "#f39c12" }}>{(pack.abo * (1 - remiseAbo / 100)).toFixed(2)}€/mois</span>
            </div>
          </div>
        )}
      </div>
      {malus < 0 && <div style={{ marginTop: 8, fontSize: 11, color: "#e74c3c", background: "rgba(192,57,43,0.1)", borderRadius: 4, padding: "4px 8px" }}>⚠ Malus : {malus}€ sur commission</div>}
    </div>
  );
}

function Section({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.18)", borderRadius: 7, color: "#c0392b", fontWeight: 700, fontSize: 11, padding: "8px 14px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: open ? 10 : 0, letterSpacing: 1, textTransform: "uppercase" }}>
        {icon} {title}<span style={{ marginLeft: "auto", opacity: 0.4 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && children}
    </div>
  );
}

function PackGrid({ packs, selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
      {packs.map(p => (
        <button key={p.ref} onClick={() => onToggle(p.ref)} style={pill(!!selected[p.ref])}>
          <span style={{ opacity: 0.5, fontSize: 10, marginRight: 4 }}>{p.ref}</span>{p.label}<span style={{ opacity: 0.4, fontSize: 10, marginLeft: 5 }}>{p.prixMat}€</span>
        </button>
      ))}
    </div>
  );
}

export default function VerisureConfig() {
  const [typePro, setTypePro] = useState(false);
  const [remiseInstall, setRemiseInstall] = useState(false);
  const [engagement, setEngagement] = useState(0);
  const [remscOption, setRemscOption] = useState("none");
  const [vdCA, setVdCA] = useState(0);
  const [aboXcaSet, setAboXcaSet] = useState(new Set());
  const toggleAboXca = (v) => setAboXcaSet(prev => { const next = new Set(prev); if (next.has(v)) next.delete(v); else next.add(v); return next; });
  const aboXcaTotal = useMemo(() => [...aboXcaSet].reduce((s, v) => s + v, 0), [aboXcaSet]);
  const malusAboXcaTotal = useMemo(() => [...aboXcaSet].reduce((s, v) => s + calcMalusABOXCA(v), 0), [aboXcaSet]);
  const [integrale, setIntegrale] = useState({ active: false, produits: {} });
  const toggleIntegraleProduit = (ref) => setIntegrale(prev => {
    const produits = { ...prev.produits };
    if (produits[ref] !== undefined) { delete produits[ref]; }
    else { if (Object.keys(produits).length >= 2) return prev; produits[ref] = {}; }
    return { ...prev, produits };
  });
  const updateIntegraleCfg = (ref, cfg) => setIntegrale(prev => ({ ...prev, produits: { ...prev.produits, [ref]: cfg } }));
  const [packsPerim, setPacksPerim] = useState({});
  const [packsVol, setPacksVol] = useState({});
  const [packsArlo, setPacksArlo] = useState({});
  const [packsExtra, setPacksExtra] = useState({});
  const togglePack = (setter, ref) => setter(prev => { const n = { ...prev }; if (n[ref] !== undefined) delete n[ref]; else n[ref] = {}; return n; });
  const updateCfg = (setter, ref, cfg) => setter(prev => ({ ...prev, [ref]: cfg }));

  const remiseEngagement = useMemo(() => {
    if (engagement === 36) return 400;
    if (engagement === 12 && !typePro) return 200;
    if (engagement === 24 && typePro) return 200;
    return 0;
  }, [engagement, typePro]);

  const engagementAlert = useMemo(() => {
    if (engagement === 12 && typePro) return "12 mois = remise résidentiel uniquement";
    if (engagement === 24 && !typePro) return "24 mois = remise pro uniquement";
    return null;
  }, [engagement, typePro]);

  const allPacks = useMemo(() => [
    ...Object.entries(packsPerim).map(([r, c]) => ({ pack: PACKS_PERIM.find(p => p.ref === r), cfg: c })),
    ...Object.entries(packsVol).map(([r, c]) => ({ pack: PACKS_VOL.find(p => p.ref === r), cfg: c })),
    ...Object.entries(packsArlo).map(([r, c]) => ({ pack: PACKS_ARLO.find(p => p.ref === r), cfg: c })),
    ...Object.entries(packsExtra).map(([r, c]) => ({ pack: EXTRAS.find(p => p.ref === r), cfg: c })),
  ].filter(x => x.pack), [packsPerim, packsVol, packsArlo, packsExtra]);

  const commission = useMemo(() => {
    let base = 0, malusPacks = 0, caMAT = 0;
    if (engagement === 36) base = 130;
    else if ((engagement === 12 || engagement === 24) && remscOption === "REMSC") base = 110;
    else if ((engagement === 12 || engagement === 24) && remscOption === "REMSC5") base = 145;
    else base = 180;
    if (integrale.active) {
      const entries = Object.entries(integrale.produits);
      entries.forEach(([ref, cfg]) => {
        const prod = INTEGRALE_PRODUITS.find(p => p.ref === ref);
        if (!prod) return;
        caMAT += prod.prixMat * (1 - (cfg.remiseMat || 0) / 100);
        const autrePleinTarif = entries.some(([oRef, oCfg]) => oRef !== ref && (oCfg.remiseMat || 0) === 0);
        malusPacks += calcMalusPack({ remiseMat: cfg.remiseMat || 0, remiseAbo: cfg.remiseAbo || 0, abo: prod.abo, ref, isIntegrale: true, autreProduitIntegraleEnPleinTarif: autrePleinTarif });
      });
    }
    allPacks.forEach(({ pack, cfg }) => {
      caMAT += pack.prixMat * (1 - (cfg.remiseMat || 0) / 100);
      malusPacks += calcMalusPack({ remiseMat: cfg.remiseMat || 0, remiseAbo: cfg.remiseAbo || 0, abo: pack.abo, ref: pack.ref, isIntegrale: false, autreProduitIntegraleEnPleinTarif: false });
    });
    const commPacks = caMAT * 0.25;
    let bonusVD = 0;
    if (vdCA > 0) bonusVD = typePro ? (caMAT >= 100 ? 200 : 100) : (caMAT >= 100 ? 100 : 50);
    return { base, commPacks, bonusVD, malusPacks, malusABO: malusAboXcaTotal, caMAT, total: base + commPacks + bonusVD + malusPacks + malusAboXcaTotal };
  }, [typePro, engagement, remscOption, vdCA, aboXcaSet, integrale, allPacks]);

  const prixClient = useMemo(() => {
    let install = 799 - (remiseInstall ? 200 : 0) - remiseEngagement;
    let abo = typePro ? 65 : 51.9;
    if (remscOption === "REMSC") abo -= 10;
    if (remscOption === "REMSC5") abo -= 5;
    if (integrale.active) {
      Object.entries(integrale.produits).forEach(([ref, cfg]) => {
        const prod = INTEGRALE_PRODUITS.find(p => p.ref === ref);
        if (!prod) return;
        install += prod.prixMat * (1 - (cfg.remiseMat || 0) / 100);
        abo += prod.abo * (1 - (cfg.remiseAbo || 0) / 100);
      });
    }
    allPacks.forEach(({ pack, cfg }) => {
      install += pack.prixMat * (1 - (cfg.remiseMat || 0) / 100);
      abo += pack.abo * (1 - (cfg.remiseAbo || 0) / 100);
    });
    abo -= aboXcaTotal;
    return { install: Math.max(0, install), abo: Math.max(0, abo) };
  }, [typePro, remiseInstall, remiseEngagement, remscOption, aboXcaTotal, integrale, allPacks]);

  const allCodes = useMemo(() => {
    const codes = [];
    const add = (cfg, ref) => { if (cfg.remiseMat > 0) codes.push(getCodeMAT(ref, cfg.remiseMat)); if (cfg.remiseAbo > 0) codes.push(getCodeABO(ref, cfg.remiseAbo)); };
    if (integrale.active) Object.entries(integrale.produits).forEach(([ref, cfg]) => add(cfg, ref));
    allPacks.forEach(({ pack, cfg }) => add(cfg, pack.ref));
    if (aboXcaSet.size > 0) [...aboXcaSet].sort((a, b) => a - b).forEach(v => codes.push(`ABO${v}CA`));
    return codes.filter(Boolean);
  }, [integrale, allPacks, aboXcaSet]);

  const S = { container: { minHeight: "100vh", background: "#0b0b16", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e8e8e8", padding: "20px 14px" } };

  return (
    <div style={S.container}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#e74c3c", textTransform: "uppercase" }}>Configurateur commercial</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "4px 0 0", background: "linear-gradient(90deg,#e74c3c,#ff7675)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verisure</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* CONFIG */}
          <div>
            <Section title="Paramètres de la vente" icon="⚙️">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
                <div style={lbl}><span style={lblTxt}>Client</span><div style={{ display: "flex", gap: 6 }}>{[["Rési", false], ["Pro", true]].map(([t, v]) => <button key={t} onClick={() => setTypePro(v)} style={pill(typePro === v)}>{t}</button>)}</div></div>
                <div style={lbl}>
                  <span style={lblTxt}>Engagement</span>
                  <div style={{ display: "flex", gap: 6 }}>{[[0, "Libre"], [12, "12m"], [24, "24m"], [36, "36m"]].map(([v, t]) => <button key={v} onClick={() => setEngagement(v)} style={pill(engagement === v)}>{t}</button>)}</div>
                  {remiseEngagement > 0 && <span style={{ fontSize: 11, color: "#2ecc71" }}>✓ -{remiseEngagement}€ HT matériel</span>}
                  {engagementAlert && <span style={{ fontSize: 11, color: "#f39c12" }}>⚠ {engagementAlert}</span>}
                </div>
                <div style={lbl}><span style={lblTxt}>Remise install.</span><button onClick={() => setRemiseInstall(r => !r)} style={pill(remiseInstall)}>{remiseInstall ? "✓ -200€ HT" : "Non"}</button></div>
                <div style={lbl}><span style={lblTxt}>Vente directe</span><div style={{ display: "flex", gap: 6 }}>{[["Non", 0], ["Oui", 1]].map(([t, v]) => <button key={t} onClick={() => setVdCA(v)} style={pill(vdCA === v)}>{t}</button>)}</div></div>
                {(engagement === 12 || engagement === 24) && (
                  <div style={lbl}><span style={lblTxt}>REMSC</span><div style={{ display: "flex", gap: 6 }}>{[["Std", "none"], ["REMSC", "REMSC"], ["REMSC5", "REMSC5"]].map(([t, v]) => <button key={v} onClick={() => setRemscOption(v)} style={pill(remscOption === v)}>{t}</button>)}</div></div>
                )}
              </div>
              <div style={{ padding: "12px 14px", background: "rgba(108,52,131,0.08)", border: "1px solid rgba(108,52,131,0.2)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#9b59b6", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 8 }}>🔑 Dérogation ABO (ABOXCA) — cumulable · indépendant des packs</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{[1, 2, 3, 4, 5, 6, 7].map(v => <button key={v} onClick={() => toggleAboXca(v)} style={pill(aboXcaSet.has(v), "#6c3483")}>ABO{v}CA</button>)}</div>
                {aboXcaSet.size > 0 && <div style={{ marginTop: 8, fontSize: 11, color: "#9b59b6" }}>Total : <strong>-{aboXcaTotal}€/mois</strong> · Malus : <strong>{malusAboXcaTotal}€</strong><div style={{ color: "#444", marginTop: 3 }}>{[...aboXcaSet].sort((a, b) => a - b).map(v => <span key={v} style={{ marginRight: 10 }}>ABO{v}CA : -{10 + v * 5}€</span>)}</div></div>}
              </div>
            </Section>

            <Section title="Sécurité Intégrale" icon="🛡️">
              <button onClick={() => setIntegrale(i => ({ ...i, active: !i.active, produits: {} }))} style={{ ...pill(integrale.active), marginBottom: integrale.active ? 10 : 0 }}>{integrale.active ? "✓ Option activée" : "+ Ajouter"} (+199€ HT · jusqu'à 2 produits)</button>
              {integrale.active && <>
                <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Sélectionne jusqu'à <strong style={{ color: "#e74c3c" }}>2 produits</strong> — {Object.keys(integrale.produits).length}/2 sélectionné(s)</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {INTEGRALE_PRODUITS.map(p => {
                    const isSel = integrale.produits[p.ref] !== undefined;
                    const isDis = !isSel && Object.keys(integrale.produits).length >= 2;
                    return <button key={p.ref} onClick={() => !isDis && toggleIntegraleProduit(p.ref)} style={{ ...pill(isSel), opacity: isDis ? 0.35 : 1, cursor: isDis ? "not-allowed" : "pointer" }}><span style={{ opacity: 0.5, fontSize: 10, marginRight: 4 }}>{p.ref}</span>{p.label}<span style={{ opacity: 0.4, fontSize: 10, marginLeft: 5 }}>{p.prixMat}€</span></button>;
                  })}
                </div>
                {Object.entries(integrale.produits).map(([ref, cfg]) => <PackConfig key={ref} pack={INTEGRALE_PRODUITS.find(p => p.ref === ref)} config={cfg} onChange={c => updateIntegraleCfg(ref, c)} />)}
              </>}
            </Section>

            <Section title="Packs Périmètriques" icon="🔴">
              <PackGrid packs={PACKS_PERIM} selected={packsPerim} onToggle={r => togglePack(setPacksPerim, r)} />
              {Object.entries(packsPerim).map(([r, c]) => <PackConfig key={r} pack={PACKS_PERIM.find(p => p.ref === r)} config={c} onChange={cfg => updateCfg(setPacksPerim, r, cfg)} />)}
            </Section>
            <Section title="Packs Volumétriques" icon="🔴">
              <PackGrid packs={PACKS_VOL} selected={packsVol} onToggle={r => togglePack(setPacksVol, r)} />
              {Object.entries(packsVol).map(([r, c]) => <PackConfig key={r} pack={PACKS_VOL.find(p => p.ref === r)} config={c} onChange={cfg => updateCfg(setPacksVol, r, cfg)} />)}
            </Section>
            <Section title="Packs Caméras Arlo" icon="📷">
              <PackGrid packs={PACKS_ARLO} selected={packsArlo} onToggle={r => togglePack(setPacksArlo, r)} />
              {Object.entries(packsArlo).map(([r, c]) => <PackConfig key={r} pack={PACKS_ARLO.find(p => p.ref === r)} config={c} onChange={cfg => updateCfg(setPacksArlo, r, cfg)} />)}
            </Section>
            <Section title="Éléments Supplémentaires" icon="➕">
              <PackGrid packs={EXTRAS} selected={packsExtra} onToggle={r => togglePack(setPacksExtra, r)} />
              {Object.entries(packsExtra).map(([r, c]) => <PackConfig key={r} pack={EXTRAS.find(p => p.ref === r)} config={c} onChange={cfg => updateCfg(setPacksExtra, r, cfg)} />)}
            </Section>
          </div>

          {/* RÉCAP */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.18)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#e74c3c", textTransform: "uppercase", marginBottom: 10 }}>💶 Prix client</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>Base : 799€ HT</div>
              {remiseInstall && <div style={{ fontSize: 12, color: "#2ecc71", marginBottom: 3 }}>— Remise 7j : -200€ HT</div>}
              {remiseEngagement > 0 && <div style={{ fontSize: 12, color: "#2ecc71", marginBottom: 3 }}>— Engagement {engagement}m : -{remiseEngagement}€ HT</div>}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 700 }}>Installation</span><span style={{ fontSize: 20, fontWeight: 900 }}>{prixClient.install.toFixed(0)}€ HT</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700 }}>Abonnement</span><span style={{ fontSize: 20, fontWeight: 900 }}>{prixClient.abo.toFixed(2)}€/mois</span></div>
              </div>
            </div>

            <div style={{ background: "rgba(39,174,96,0.06)", border: "1px solid rgba(39,174,96,0.18)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#2ecc71", textTransform: "uppercase", marginBottom: 10 }}>💰 Commission</div>
              {[
                { label: "Base Kit START", val: commission.base, col: "#bbb" },
                commission.commPacks > 0 && { label: `Packs 25% (${commission.caMAT.toFixed(0)}€)`, val: commission.commPacks, col: "#f39c12" },
                commission.bonusVD > 0 && { label: `Bonus VD${typePro ? " Pro" : ""}`, val: commission.bonusVD, col: "#3498db" },
                commission.malusPacks < 0 && { label: "Malus packs", val: commission.malusPacks, col: "#e74c3c" },
                commission.malusABO < 0 && { label: `Malus ABOXCA`, val: commission.malusABO, col: "#9b59b6" },
              ].filter(Boolean).map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                  <span style={{ color: "#666" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.col }}>{row.val >= 0 ? "+" : ""}{row.val.toFixed(0)}€</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 10, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 800 }}>TOTAL</span>
                <span style={{ fontWeight: 900, fontSize: 26, color: commission.total >= 0 ? "#2ecc71" : "#e74c3c" }}>{commission.total.toFixed(0)}€</span>
              </div>
            </div>

            {(() => {
              const ca = commission.caMAT;
              const prime = ca >= 400 ? 60 : ca > 0 ? 40 : 0;
              if (prime === 0) return null;
              return (
                <div style={{ background: "rgba(52,152,219,0.07)", border: "1px solid rgba(52,152,219,0.18)", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#3498db", textTransform: "uppercase", marginBottom: 6 }}>🏠 Prime installation</div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>CA packs : <strong style={{ color: "#f39c12" }}>{ca.toFixed(0)}€</strong></div>
                  <div style={{ fontSize: 11, color: "#555" }}>{ca >= 400 ? "≥ 400€ → Prime 60€" : "> 0€ → Prime 40€"}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#3498db", marginTop: 4 }}>+{prime}€</div>
                  <div style={{ fontSize: 10, color: "#444", marginTop: 4 }}>⚠ Hors cadeau de closing</div>
                </div>
              );
            })()}

            {allCodes.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>🏷️ Codes à saisir</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {allCodes.map(code => <span key={code} style={{ background: "#111128", border: "1px solid rgba(192,57,43,0.3)", color: "#e74c3c", borderRadius: 4, padding: "4px 9px", fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{code}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
