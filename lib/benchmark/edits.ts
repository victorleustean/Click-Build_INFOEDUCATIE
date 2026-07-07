//date pentru simularea de benchmark DCS vs naiv
//codul initial = un site generat de CBD
//editsList = 50 de instructiuni de modificare

//cod initial  
export const initialCode = `function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const [navHover, setNavHover] = useState(null);
  
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
  
    const colors = {
      accent: "#e91e63",
      dark: "#1a1a1a",
      light: "#ffffff",
      muted: "#6b7280"
    };
  
    const services = [
      { title: "Pâine artizanală", desc: "Coaptă zilnic din maia naturală", icon: "Wheat" },
      { title: "Patiserie franceză", desc: "Croissante și pain au chocolat", icon: "Croissant" },
      { title: "Torturi la comandă", desc: "Pentru orice ocazie specială", icon: "Cake" },
      { title: "Cafea de specialitate", desc: "Boabe prăjite local", icon: "Coffee" }
    ];
  
    const testimonials = [
      { name: "Maria Popescu", text: "Cea mai bună brutărie din oraș!", role: "Client fidel" },
      { name: "Andrei Ionescu", text: "Pâinea lor e pur și simplu excepțională.", role: "Local" }
    ];
  
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", color: colors.dark }}>
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "1.25rem 2rem", borderBottom: "1px solid #eee", position: "sticky",
          top: 0, background: colors.light, zIndex: 100
        }}>
          <span style={{ fontWeight: 800, fontSize: "1.4rem", color: colors.accent }}>Brutăria Petru</span>
          <div style={{ display: isMobile ? "none" : "flex", gap: "2rem" }}>
            {["Acasă", "Servicii", "Despre", "Contact"].map((item, i) => (
              <a key={i} href="#"
                onMouseEnter={() => setNavHover(i)}
                onMouseLeave={() => setNavHover(null)}
                style={{
                  textDecoration: "none",
                  color: navHover === i ? colors.accent : colors.dark,
                  fontWeight: 500, transition: "color 0.2s"
                }}>
                {item}
              </a>
            ))}
          </div>
        </nav>
  
        <section style={{
          display: "flex", flexDirection: isMobile ? "column" : "row",
          alignItems: "center", gap: "3rem", padding: "5rem 2rem", maxWidth: 1200, margin: "0 auto"
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? "2.2rem" : "3.5rem", fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
              Pâine proaspătă în fiecare dimineață
            </h1>
            <p style={{ fontSize: "1.2rem", color: colors.muted, margin: "1.5rem 0" }}>
              Tradiție și pasiune în fiecare produs copt cu grijă pentru tine.
            </p>
            <button style={{
              background: colors.accent, color: colors.light, border: "none",
              padding: "0.9rem 2rem", borderRadius: 10, fontSize: "1rem", fontWeight: 600, cursor: "pointer"
            }}>
              Comandă acum
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <img src="img1" alt="Pâine" style={{ width: "100%", borderRadius: 16, objectFit: "cover" }} />
          </div>
        </section>
  
        <section style={{ padding: "4rem 2rem", background: "#fafafa" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700, marginBottom: "3rem" }}>
            Serviciile noastre
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "1.5rem", maxWidth: 1200, margin: "0 auto"
          }}>
            {services.map((s, i) => (
              <div key={i} style={{
                background: colors.light, padding: "2rem", borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)", textAlign: "center"
              }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, margin: "0 0 0.5rem" }}>{s.title}</h3>
                <p style={{ color: colors.muted, fontSize: "0.95rem", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
  
        <section style={{ padding: "4rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2.2rem", fontWeight: 700, marginBottom: "3rem" }}>
            Ce spun clienții
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: "#fafafa", padding: "2rem", borderRadius: 14
              }}>
                <p style={{ fontSize: "1.05rem", fontStyle: "italic", margin: "0 0 1rem" }}>"{t.text}"</p>
                <p style={{ fontWeight: 600, margin: 0 }}>{t.name}</p>
                <p style={{ color: colors.muted, fontSize: "0.9rem", margin: 0 }}>{t.role}</p>
              </div>
            ))}
          </div>
        </section>
  
        <footer style={{
          background: colors.dark, color: colors.light, padding: "3rem 2rem", textAlign: "center"
        }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem" }}>Brutăria Petru</p>
          <p style={{ margin: "0.5rem 0 0", color: "#999" }}>Str. Principală 12, Piatra Neamț</p>
        </footer>
      </div>
    );
  }`;
  
  //50 de instructiuni de editare 
  export const editsList: string[] = [
    "Schimbă culoarea accentului din roz în albastru",
    "Mărește titlul din hero să fie mai impactant",
    "Adaugă o secțiune de prețuri cu trei pachete",
    "Fă butonul principal mai rotunjit",
    "Schimbă fontul titlurilor într-unul mai elegant",
    "Adaugă o secțiune de galerie cu patru imagini",
    "Pune un formular de contact în partea de jos",
    "Schimbă textul din hero să menționeze livrarea gratuită",
    "Adaugă iconițe la fiecare serviciu",
    "Fă navbar-ul transparent la început",
    "Adaugă un efect de fade-in la secțiuni",
    "Schimbă culoarea footerului în maro închis",
    "Adaugă un buton de programare în navbar",
    "Mărește spațierea dintre secțiuni",
    "Adaugă o hartă cu locația brutăriei",
    "Schimbă imaginea din hero",
    "Adaugă o secțiune despre echipă",
    "Pune un slogan sub logo în navbar",
    "Fă cardurile de servicii să aibă hover effect",
    "Adaugă un newsletter de abonare",
    "Schimbă culoarea accentului din albastru în verde",
    "Adaugă programul de funcționare în footer",
    "Mărește dimensiunea imaginilor din galerie",
    "Adaugă o secțiune de întrebări frecvente",
    "Schimbă textul butonului în Rezervă o masă",
    "Adaugă link-uri către rețele sociale în footer",
    "Fă titlul din hero pe două rânduri",
    "Adaugă un badge de recenzii sub hero",
    "Schimbă layout-ul serviciilor în două coloane",
    "Adaugă o bară de anunțuri sus cu o ofertă",
    "Pune testimoniale într-un carusel",
    "Schimbă culoarea de fundal a secțiunii servicii",
    "Adaugă o secțiune de statistici cu numere",
    "Fă footerul cu trei coloane",
    "Adaugă un buton de revenire sus",
    "Schimbă stilul cardurilor în unul cu bordură",
    "Adaugă o secțiune de meniu cu prețuri",
    "Mărește contrastul textului din hero",
    "Adaugă o imagine de fundal la secțiunea despre",
    "Schimbă forma butoanelor în complet rotunde",
    "Adaugă un counter animat la statistici",
    "Pune logo-ul mai mare în navbar",
    "Adaugă o secțiune de parteneri cu logo-uri",
    "Schimbă paleta de culori într-una mai caldă",
    "Adaugă un video de prezentare în hero",
    "Fă secțiunea de contact cu hartă și formular alăturate",
    "Adaugă animație la apariția cardurilor",
    "Schimbă fontul întregului site",
    "Adaugă un chat widget în colțul din dreapta jos",
    "Revino la versiunea cu accentul roz original"
  ];