"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Info,
  ExternalLink,
  TrendingUp,
  ArrowDown,
  Vote,
  Landmark,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Globe,
  Monitor,
  ChevronRight,
  SkipForward,
  Play,
  RotateCcw,
  Calculator,
  Github
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Translations
type Language = "hu" | "en"

const translations = {
  hu: {
    title: "A magyar választási rendszer",
    titleAccent: "torzításai",
    subtitle: "Hogyan lesznek a népszerűségi adatokból mandátumok?",
    seatDistribution: "Mandátumeloszlás",
    majority: "többség",
    twoThirds: "2/3",
    transformationFlow: "Az átalakulás menete",
    fairPreference: "Valós preferencia",
    measuredPreference: "Mért preferencia",
    measuredPreferenceTooltip: "Bemenet: a közvéleménykutatásokból származó pártpreferencia-adatok. Számítás: a magyar vegyes választási rendszert modellezzük – 106 egyéni körzet (győztes mindent visz) + 93 listás mandátum (D'Hondt arányos elosztás). Az 5% alatti pártok nem jutnak be. Az egyéni körzetekben a Fidesz ~1%-os strukturális előnyét és a vezető párt nemlineáris mandátumbónuszát is figyelembe vesszük. Nem modellezzük: részvételi különbségek, körzeti szintű eltérések.",
    finalSeats: "Végső mandátum",
    opinionFormingBiases: "Véleményformáló torzítások",
    voteGatheringBiases: "Külföldi szavazatok",
    seatConversionBiases: "Mandátumszámítási torzítások",
    opinionFormingDesc: "propaganda, szavazatvásárlás",
    voteGatheringDesc: "levélszavazás, nagykövetségi",
    seatConversionDesc: "gerrymandering, győzteskompenzáció",
    voterPreference: "Valós szavazói preferencia",
    voterPreferenceTooltip: "Ez az elméleti szavazati arány, ha nem lenne állami propaganda és egyéb véleményformáló torzítás. A közvéleménykutatások már tartalmazzák ezeket a hatásokat!",
    opinionFormingFactorsTitle: "Véleményformáló torzítások",
    opinionFormingFactorsDesc: "Ezek a tényezők a hazai szavazók véleményét befolyásolják – a közvéleménykutatások már tartalmazzák őket.",
    voteGatheringFactorsTitle: "Külföldi szavazatok",
    voteGatheringFactorsDesc: "Ezek a szavazatok nem szerepelnek a belföldi közvéleménykutatásokban.",
    seatConversionFactorsTitle: "Mandátumszámítási torzítások",
    seatConversionFactorsDesc: "Ezek a tényezők azt befolyásolják, hogyan alakulnak a szavazatok mandátumokká.",
    references: "Források és hivatkozások",
    sources: "Források:",
    legendTitle: "Jelmagyarázat:",
    legendTextNew: "A szám mellett látható érték mutatja, mekkora lenne a párt támogatottsága véleményformáló torzítások nélkül.",
    fair: "valós",
    measuredVotesTitle: "Mért szavazatok (közvéleménykutatás)",
    measuredVotesTooltip: "Ez a közvéleménykutatások által mért szavazati arány. Ez már tartalmazza a propaganda és egyéb szavazatszerzési torzítások hatását!",
    othersNote: "A százalékok nem adnak ki 100%-ot, mert vannak egyéb pártok is, amelyek nem jutnak be a parlamentbe.",
    voteShare: "szavazat",
    helpsWinner: "Győztest segíti",
    seats: "mandátum",
    headerLabel: "lejtapalya.hu",
    // Tour translations
    tour: {
      next: "Következő",
      back: "Vissza",
      skip: "Ugrás a dashboardhoz",
      startExploring: "Felfedezés indítása",
      finish: "Befejezés",
      stepOf: "lépés",
      restartTour: "Túra újraindítása",
      introTitle: "Kinek lejt a pálya?",
      introText: "Hajlamosak vagyunk a közvélemény-kutatás számait azonossá tenni a parlamentben megszerzett mandátumok arányaival. Ez az interaktív eszköz segít megérteni, hogy miért nincs ez így, hol lejt a pálya és hol súlyoz furcsán a magyar választási rendszer.",
      contextTitle: "A lejtős pálya története",
      contextText: "A magyar választási rendszer 1989 óta nem arányos, a győztest segíti. A Fidesz 2010-es hatalomra kerülése óta azonban szisztematikusan törekedett arra, hogy a rendszer még inkább neki kedvezzen. Az állami propagandától kezdve a visszaélésekre lehetőséget adó levélszavazatokon át a kétfordulós szavazás eltörléséig – mind tudatos, a választási eredményt befolyásoló lépésként értékelhetőek.\n\nEz az alkalmazás nem törekszik pontos választási előrejelzésre, csupán megmutatja, nagyjából hogyan adódnak össze ezek a hatások, hogyan lejt a pálya – de az is kirajzolódik, hogy bizonyos elemek hogyan üthetnek vissza egy erős ellenzéki párt megjelenésével.",
      howItWorksTitle: "Hogyan működik?",
      howItWorksText: "Ez az eszköz nem előrejelzés, hanem egy interaktív szimulátor, amely segít megérteni a választási rendszer torzításait.",
      howItWorksFeatures: [
        "Beállíthatod a közvéleménykutatási adatokat a legfrissebb mérések alapján",
        "Minden torzítási tényezőt külön-külön ki- és bekapcsolhatsz",
        "A csúszkákkal módosíthatod az egyes torzítások becsült mértékét",
        "Minden torzításhoz forrásokat és hivatkozásokat biztosítunk",
      ],
      howItWorksNote: "Az alapértelmezett értékek kutatásokon és becsléseken alapulnak – szabadon módosíthatod őket saját megítélésed szerint.",
      methodologyTitle: "Számítási módszertan",
      methodologyText: "Egyszerűsített modellt használunk, amely a taktikaiszavazas.hu módszertanából merít inspirációt. A magyar vegyes választási rendszert modellezzük: 106 egyéni körzet (győztes mindent visz) + 93 listás hely (D'Hondt). A kispártok csak listás mandátumot szerezhetnek. A véleményformáló torzítások átfedő hatását csökkenő hozadék képlettel számoljuk. A taktikaiszavazas.hu részletesebb modellt használ körzeti szintű adatokkal és részvételi modellezéssel – a mi eszközünk a torzítások megértésére fókuszál, nem pontos előrejelzésre. Eredeti módszertan:",
      methodologyLink: "taktikaiszavazas.hu/modszertan",
      pollsTitle: "Közvéleménykutatási adatok",
      pollsText: "Állítsd be a pártok jelenlegi támogatottságát a legfrissebb közvéleménykutatások alapján. Ezek az adatok már tartalmazzák a véleményformáló torzítások (propaganda, szavazatvásárlás stb.) hatását.",
      biasIntro: "A következő lépésekben megismerheted azokat a torzításokat, amelyek befolyásolják a választási eredményeket. Minden torzításnál beállíthatod annak mértékét és ki-/bekapcsolhatod.",
      adjustableNote: "Az alábbi csúszkával beállíthatod a torzítás becsült mértékét. Az alapértelmezett érték egy becslés – módosíthatod saját kutatásod alapján.",
    },
    factors: {
      propaganda: {
        name: "Állami propaganda",
        description: "A közmédia és a kormánypárti média dominanciája. Akadémiai kutatás szerint 8-12%-os választási hatással bír. A hírmédiapiac 78-80%-át kormánypárti média uralja. Az MTVA 2024-ben 142 milliárd, 2025-ben 165 milliárd forintból működik. A médiafelületek iránti bizalom 23% – az EU legalacsonyabb értéke. Magyarország a 67. a sajtószabadság-rangsorban."
      },
      voteBuying: {
        name: "Szavazatvásárlás",
        description: "Közfoglalkoztatottak nyomás alá helyezése, szelektív forrás-elosztás. Becslések szerint 2022-ben 200-300 ezer, 2026-ra 500-600 ezer szavazatot céloznak meg 53 választókerületben. Módszerek: közmunka elvétele, készpénz (5-20 ezer Ft), közművek kikapcsolása, gyámhivatali fenyegetés."
      },
      foreignVoting: {
        name: "Külföldi szavazás kettős mércéje",
        description: "Két különböző rendszer létezik: (1) Határon túli kettős állampolgárok (főként Erdély, Vajdaság, Kárpátalja) LEVÉLBEN szavazhatnak – egyszerű, otthonról. (2) Nyugaton élő magyarok magyar lakcímmel CSAK nagykövetségen, személyesen – gyakran 500+ km utazással.\n\nA torzítás forrása az eltérő hozzáférés: a levélszavazásnál gyengébb az azonosítás (a szavazatot \"meghatalmazás nélküli személy\" is leadhatja), míg a követségi szavazás szigorú személyazonosítást igényel.\n\nA határon túliak korábbi Fidesz-preferenciája (2022: 93%) több okra vezethető vissza: a kormány nemzetpolitikája, kettős állampolgárság megadása, illetve a helyi magyar pártok (RMDSZ, VMSZ) Fidesszel való szövetsége. Ezek a tényezők változhatnak – a csúszka mindkét irányba állítható."
      },
      gerrymandering: {
        name: "Gerrymandering",
        description: "A 2011-es törvény átláthatatlanul rajzolta át a körzeteket. Szimulációk szerint egyenlő szavazatarány esetén a Fidesz ~10 mandátummal előrébb végezne. Az ellenzéknek 3-5%-kal több szavazatra van szüksége a többséghez. A 2002-es és 2006-os választás is Fidesz-győzelem lett volna az új térképpel."
      },
      twoRound: {
        name: "Kétfordulós szavazás eltörlése",
        description: "2011-ben egyfordulós relatív többségi rendszerre váltottak. 2014-ben a Fidesz 44%-os listás eredménnyel 91/106 egyéni körzetet nyert (86%). A töredezett ellenzék 35-40%-os Fidesz-győzelmeket eredményezett sok körzetben. Ez megakadályozza az ellenzék taktikai összefogását."
      },
      minorityMp: {
        name: "Kisebbségi képviselő",
        description: "A magyar választási rendszer 13 nemzetiség számára biztosít kedvezményes mandátumot. A nemzetiségi listára szavazók nem szavazhatnak pártlistára. Ha a nemzetiségi lista eléri a pártlistás mandátumhoz szükséges szavazatok 25%-át (~25.000 szavazat), teljes jogú képviselőt küldhet a parlamentbe. 2018–2022-ben a német nemzetiség képviselője (Ritter Imre) következetesen a kormánypárttal szavazott. A csúszka mindkét irányba állítható az új képviselő várható szavazási mintája alapján."
      },
      winnerCompensation: {
        name: "Győzteskompenzáció",
        description: "A győztes egyéni jelöltek többletszavazatai átkerülnek a pártlistára – világviszonylatban egyedülálló szabály. 2022-ben ~5 extra mandátumot hozott a Fidesznek. E nélkül sem 2014-ben, sem 2018-ban nem lett volna kétharmad. A mindenkori győztest segíti – ha a Tisza vezet, nekik kedvez!"
      },
      parliamentSize: {
        name: "Parlament létszámának csökkentése",
        description: "386-ról 199-re csökkentették a létszámot. A többségi elem aránya 46%-ról 53%-ra nőtt. Ez a 2011-es változás TOVÁBBI torzítást hozott az 1989-es alaprendszerhez képest. A mindenkori győztest segíti – ha a Tisza vezet, nekik kedvez."
      },
      electoralWeighting: {
        name: "Választási rendszer súlyozása (1989 óta)",
        description: "A magyar vegyes rendszer ALAP győztes-torzítása – ez nem Fidesz-találmány, 1989 óta létezik. A többségi elem természeténél fogva a győztest segíti. Ez egy százalékos érték, amely a pártok közötti különbséggel arányosan hat: nagyobb előny → nagyobb mandátumbónusz. Szoros versenynél a hatás kisebb."
      }
    },
    legal: {
      operator: "Üzemeltető",
      operatorName: "Gazda Gergely",
      operatorEmail: "gergo@lejtapalya.hu",
      privacyPolicy: "Adatvédelmi tájékoztató",
      cookiePolicy: "Cookie (süti) tájékoztató",
      privacyTitle: "Adatvédelmi tájékoztató",
      privacyContent: `A lejtapalya.hu weboldal üzemeltetője Gazda Gergely (gergo@lejtapalya.hu).

Ez az oldal NEM gyűjt személyes adatokat. Nem használunk Google Analytics-et vagy más nyomkövető szolgáltatást.

A weboldalt a Vercel Inc. (San Francisco, USA) szerverein tároljuk. A Vercel automatikusan rögzíthet technikai adatokat (IP-cím, böngésző típusa) a szolgáltatás működtetéséhez, de ezeket nem adjuk át harmadik félnek marketing célokra.

Kapcsolat: gergo@lejtapalya.hu`,
      cookieTitle: "Cookie (süti) tájékoztató",
      cookieContent: `A lejtapalya.hu weboldal minimális cookie-kat használ.

Használt cookie-k:
• Technikai cookie-k: A Vercel tárhelyszolgáltató által használt, a weboldal működéséhez szükséges cookie-k. Ezek nem gyűjtenek személyes adatokat.

NEM használunk:
• Marketing cookie-kat
• Google Analytics-et
• Közösségi média követőket
• Harmadik féltől származó reklám cookie-kat

A böngésző beállításaiban letilthatod a cookie-kat, de ez befolyásolhatja az oldal működését.`,
      close: "Bezárás",
      sourceCode: "Forráskód"
    }
  },
  en: {
    title: "Biases in the Hungarian",
    titleAccent: "Electoral System",
    subtitle: "How are votes converted to seats? Adjust the parameters and observe the effect.",
    seatDistribution: "Seat Distribution",
    majority: "majority",
    twoThirds: "2/3",
    transformationFlow: "Transformation flow",
    fairPreference: "Fair preference",
    measuredPreference: "Measured preference",
    measuredPreferenceTooltip: "Input: party preference data from polls. Calculation: we model Hungary's mixed electoral system – 106 single-member districts (winner-takes-all) + 93 list seats (D'Hondt proportional). Parties below 5% don't enter parliament. We account for Fidesz's ~1% structural SMD advantage and the leading party's non-linear seat bonus. Not modeled: turnout differences, district-level variations.",
    finalSeats: "Final seats",
    opinionFormingBiases: "Opinion-forming biases",
    voteGatheringBiases: "Foreign votes",
    seatConversionBiases: "Seat-conversion biases",
    opinionFormingDesc: "propaganda, vote buying",
    voteGatheringDesc: "mail voting, embassy",
    seatConversionDesc: "gerrymandering, winner compensation",
    voterPreference: "Fair voter preference",
    voterPreferenceTooltip: "This is the theoretical vote share without state propaganda and other opinion-forming biases. Polls already include these effects!",
    opinionFormingFactorsTitle: "Opinion-forming biases",
    opinionFormingFactorsDesc: "These factors influence domestic voter opinions – polls already include them.",
    voteGatheringFactorsTitle: "Foreign votes",
    voteGatheringFactorsDesc: "These votes are not included in domestic polls.",
    seatConversionFactorsTitle: "Seat-conversion biases",
    seatConversionFactorsDesc: "These factors affect how votes are converted to seats.",
    references: "Sources and references",
    sources: "Sources:",
    legendTitle: "Legend:",
    legendTextNew: "The value next to the number shows what the party's support would be without opinion-forming biases.",
    fair: "fair",
    measuredVotesTitle: "Measured votes (polls)",
    measuredVotesTooltip: "This is the vote share measured by polls. It already includes the effect of propaganda and other vote-gathering biases!",
    othersNote: "Percentages don't sum to 100% because there are \"Other\" parties that don't enter parliament.",
    voteShare: "votes",
    helpsWinner: "Helps winner",
    seats: "seats",
    headerLabel: "lejtapalya.hu",
    // Tour translations
    tour: {
      next: "Next",
      back: "Back",
      skip: "Skip to dashboard",
      startExploring: "Start exploring",
      finish: "Finish",
      stepOf: "of",
      restartTour: "Restart tour",
      introTitle: "The Tilted Playing Field",
      introText: "We tend to equate poll numbers with parliamentary seat distributions. This interactive tool helps you understand why that's not the case, and where the Hungarian electoral system tilts the playing field.",
      contextTitle: "The History of the Tilted Field",
      contextText: "Hungary's electoral system has been non-proportional since 1989, favoring whoever wins. However, since coming to power in 2010, Fidesz has systematically worked to tilt the system further in its favor. From state propaganda, through mail voting that allows for abuse, to abolishing two-round voting – all can be seen as deliberate steps to influence electoral outcomes.\n\nThis application does not aim to provide precise electoral forecasts; it simply shows how these effects roughly add up, how the playing field is tilted – but it also reveals how certain elements may now backfire with the emergence of a strong opposition party.",
      howItWorksTitle: "How does it work?",
      howItWorksText: "This tool is not a prediction, but an interactive simulator that helps you understand electoral system biases.",
      howItWorksFeatures: [
        "Set poll data based on the latest measurements",
        "Toggle each bias factor on or off individually",
        "Adjust the estimated magnitude of each bias with sliders",
        "Access sources and references for every bias",
      ],
      howItWorksNote: "Default values are based on research and estimates – feel free to modify them according to your own judgment.",
      methodologyTitle: "Calculation methodology",
      methodologyText: "We use a simplified model inspired by the taktikaiszavazas.hu methodology. We model Hungary's mixed system: 106 SMD seats (winner-takes-all) + 93 list seats (D'Hondt). Small parties can only win list seats. Overlapping opinion biases use a diminishing returns formula. taktikaiszavazas.hu uses a more detailed model with district-level data and turnout modeling – our tool focuses on understanding biases, not precise forecasting. Original methodology:",
      methodologyLink: "taktikaiszavazas.hu/modszertan",
      pollsTitle: "Poll data",
      pollsText: "Set the current support levels for parties based on the latest polls. These figures already include the effects of opinion-forming biases (propaganda, vote buying, etc.).",
      biasIntro: "In the following steps, you'll learn about the biases that affect electoral outcomes. For each bias, you can adjust its magnitude and toggle it on/off.",
      adjustableNote: "Use the slider below to adjust the estimated magnitude of this bias. The default value is an estimate – feel free to modify it based on your own research.",
    },
    factors: {
      propaganda: {
        name: "State propaganda",
        description: "Dominance of public and pro-government media. Academic research estimates 8-12% electoral impact. 78-80% of news media controlled by pro-government outlets. MTVA budget: 142 billion HUF (2024), 165 billion (2025). Media trust at 23% – lowest in EU. Hungary ranks 67th in press freedom."
      },
      voteBuying: {
        name: "Vote buying",
        description: "Pressure on public workers, selective resource allocation. Estimates suggest 200-300K votes bought in 2022, targeting 500-600K in 2026 across 53 constituencies. Methods: threatening public works jobs, cash (5-20K HUF), cutting utilities, child protection threats."
      },
      foreignVoting: {
        name: "Dual standard in foreign voting",
        description: "Two different systems exist: (1) Cross-border dual citizens (mainly Transylvania, Vojvodina, Transcarpathia) can vote BY MAIL – easy, from home. (2) Hungarians living in the West with Hungarian addresses can ONLY vote at embassies IN PERSON – often requiring 500+ km travel.\n\nThe bias stems from unequal access: mail voting has weaker identification (ballots can be delivered by \"persons without authorization\"), while embassy voting requires strict ID verification.\n\nThe historical Fidesz preference among cross-border voters (2022: 93%) has multiple causes: the government's diaspora policies, granting dual citizenship, and alliances between local Hungarian parties (RMDSZ, VMSZ) and Fidesz. These factors may change – the slider works both ways."
      },
      gerrymandering: {
        name: "Gerrymandering",
        description: "The 2011 law redrew boundaries non-transparently. Simulations show with equal votes, Fidesz would win ~10 more seats. Opposition needs 3-5% more votes just to achieve a majority. The 2002 and 2006 elections would have been Fidesz wins with the new map."
      },
      twoRound: {
        name: "Abolition of two-round voting",
        description: "In 2011, switched to single-round FPTP. In 2014, Fidesz won 91/106 districts (86%) with only 44% list votes. Fragmented opposition led to 35-40% Fidesz wins in many districts. This prevents tactical opposition coordination."
      },
      minorityMp: {
        name: "Minority MP",
        description: "Hungary's electoral system provides preferential mandates for 13 recognized minorities. Minority voters cannot vote for party lists. If a minority list reaches 25% of the votes needed for a party list seat (~25,000 votes), it can send a full MP to parliament. In 2018–2022, the German minority representative (Imre Ritter) consistently voted with the governing party. The slider can be set either way based on the expected voting pattern of the new representative."
      },
      winnerCompensation: {
        name: "Winner compensation",
        description: "Surplus votes from winning candidates transfer to the party list – a globally unique rule. In 2022, it gave Fidesz ~5 extra seats. Without it, no 2/3 majority in 2014 or 2018. This helps whoever wins – if Tisza wins, it benefits them!"
      },
      parliamentSize: {
        name: "Reduction of parliament size",
        description: "Reduced from 386 to 199 seats. Majoritarian element rose from 46% to 53%. This 2011 change added ADDITIONAL distortion on top of the 1989 baseline. Helps whoever wins – if Tisza wins, it benefits them too."
      },
      electoralWeighting: {
        name: "Electoral system weighting (since 1989)",
        description: "The Hungarian mixed system's BASELINE winner-bias – not a Fidesz invention, exists since 1989. The majoritarian element naturally favors the winner. This is a percentage that scales with margin: larger lead → larger seat bonus. In close races, the effect is smaller."
      }
    },
    legal: {
      operator: "Operator",
      operatorName: "Gergely Gazda",
      operatorEmail: "gergo@lejtapalya.hu",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      privacyTitle: "Privacy Policy",
      privacyContent: `The lejtapalya.hu website is operated by Gergely Gazda (gergo@lejtapalya.hu).

This website does NOT collect personal data. We do not use Google Analytics or any other tracking service.

The website is hosted on Vercel Inc. (San Francisco, USA) servers. Vercel may automatically log technical data (IP address, browser type) for service operation, but we do not share this with third parties for marketing purposes.

Contact: gergo@lejtapalya.hu`,
      cookieTitle: "Cookie Policy",
      cookieContent: `The lejtapalya.hu website uses minimal cookies.

Cookies used:
• Technical cookies: Used by Vercel hosting provider, necessary for website operation. These do not collect personal data.

We do NOT use:
• Marketing cookies
• Google Analytics
• Social media trackers
• Third-party advertising cookies

You can disable cookies in your browser settings, but this may affect website functionality.`,
      close: "Close",
      sourceCode: "Source Code"
    }
  }
}

// Party colors
const PARTY_COLORS = {
  tisza: "hsl(217, 85%, 55%)",
  fidesz: "hsl(25, 95%, 55%)",
  smallParty: "hsl(220, 15%, 45%)",
  other: "hsl(220, 15%, 20%)",
}

const TOTAL_SEATS = 199
const SMD_SEATS = 106  // Single-member district seats (winner-take-all)
const LIST_SEATS = 93  // National list seats (proportional, D'Hondt)

// Factor categories
type FactorCategory = "opinion-forming" | "vote-gathering" | "seat-conversion"
type Beneficiary = "fidesz" | "winner" | "bidirectional"

interface Factor {
  id: string
  nameKey: string
  enabled: boolean
  value: number
  maxValue: number
  minValue: number
  category: FactorCategory
  beneficiary: Beneficiary
  references: { title: string; url: string; source: string }[]
  isElectoralSystemBias?: boolean // If true, controls SMD winner bonus instead of seat transfer
}

interface PartySeats {
  tisza: number
  fidesz: number
  smallParty: number
}

interface VoteShare {
  tisza: number
  fidesz: number
  smallParty: number
}

// Default values from Vox Populi (2026.kozvelemeny.org) aggregation
// These are the "measured" poll values (which include opinion bias effects)
const DEFAULT_MEASURED_VOTES: VoteShare = {
  tisza: 48,
  fidesz: 40,
  smallParty: 5,
}

// Calculate default fair base by subtracting default enabled biases from Fidesz only
// Default biases: propaganda=5%, vote-buying=3% → diminishing returns ≈ 7.85%
// Tisza and smallParty keep their original values (no redistribution)
const calculateFairBaseFromMeasured = (measured: VoteShare, enabledBias: number): VoteShare => {
  if (enabledBias === 0) return measured
  return {
    tisza: measured.tisza,  // Keep original value, no redistribution
    fidesz: Math.max(0, measured.fidesz - enabledBias),
    smallParty: measured.smallParty,
  }
}

// Opinion-forming biases (affect domestic voter sentiment, reflected in polls)
const opinionFormingFactors: Factor[] = [
  {
    id: "propaganda",
    nameKey: "propaganda",
    enabled: true,
    value: 3, // 2026 default (reduced from 5 in 2022)
    maxValue: 12,
    minValue: 2,
    category: "opinion-forming",
    beneficiary: "fidesz",
    references: [
      // Academic research
      { title: "Media Capture and Electoral Manipulation: A Causal Inference Analysis (2010-2025)", url: "https://www.researchgate.net/publication/398721490_Media_Capture_and_Electoral_Manipulation_A_Causal_Inference_Analysis_of_Hungary's_Democratic_Backsliding_2010-2025", source: "ResearchGate (2025)" },
      // International reports
      { title: "OSCE/ODIHR Final Report 2022", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE" },
      { title: "Hungary 2022: Manipulated Elections", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "Hungary: Nations in Transit 2024", url: "https://freedomhouse.org/country/hungary/nations-transit/2024", source: "Freedom House" },
      { title: "Hungary: Freedom in the World 2024", url: "https://freedomhouse.org/country/hungary/freedom-world/2024", source: "Freedom House" },
      { title: "Digital News Report 2024 - Hungary", url: "https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2024/hungary", source: "Reuters Institute" },
      { title: "Hungary - Press Freedom Index", url: "https://rsf.org/en/country/hungary", source: "Reporters Without Borders" },
      { title: "I Can't Do My Job as a Journalist", url: "https://www.hrw.org/report/2024/02/13/i-cant-do-my-job-journalist/systematic-undermining-media-freedom-hungary", source: "Human Rights Watch (2024)" },
      { title: "Media Capture Monitoring Report: Hungary", url: "https://ipi.media/wp-content/uploads/2024/11/Hungary-Media-Capture-Monitoring-Report-Final-1.pdf", source: "IPI (2024)" },
      { title: "EMFA Monitor Hungary", url: "https://mertek.eu/en/2024/12/03/emfa-monitor-hungary/", source: "Mérték Media Monitor" },
      // Hungarian sources
      { title: "142 milliárd forint lesz jövőre a közmédia büdzséje", url: "https://nepszava.hu/3213193_mtva-koltsegvetes-2024-kozmedia-142-milliard", source: "Népszava" },
      { title: "MTVA költségvetés 2025 - közmédia", url: "https://media1.hu/2024/10/21/mtva-koltsegvetes-2025-kozmedia/", source: "Media1" },
      { title: "Közmédia-mérleg: nem volt elég a 140 milliárd forint sem", url: "https://mfor.hu/cikkek/makro/kozmedia-merleg-nem-volt-eleg-a-140-milliard-forint-sem.html", source: "mfor.hu" },
    ]
  },
  {
    id: "vote-buying",
    nameKey: "voteBuying",
    enabled: true,
    value: 2, // 2026 default (reduced from 3 in 2022)
    maxValue: 8,
    minValue: 1,
    category: "opinion-forming",
    beneficiary: "fidesz",
    references: [
      // International reports
      { title: "What is the price of a vote? Voter intimidation in Hungary's poorest communities", url: "https://www.errc.org/news/what-is-the-price-of-a-vote-the-shocking-extent-of-voter-intimidation-in-hungarys-poorest-communities", source: "European Roma Rights Centre (2026)" },
      { title: "Election Manipulation and Electoral Fraud in Hungary", url: "https://democracyinstitute.ceu.edu/articles/balint-magyar-and-balint-madlovics-election-manipulation-and-electoral-fraud-hungary", source: "CEU Democracy Institute" },
      { title: "Hungary 2022: Manipulated Elections - Vote buying", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "OSCE/ODIHR Final Report 2022 - Voter intimidation concerns", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE" },
      { title: "Safeguarding Hungary's 2026 Elections", url: "https://www.gmfus.org/news/safeguarding-hungarys-2026-elections-robust-observation-essential", source: "German Marshall Fund" },
      { title: "The Price of a Vote in Orbán's Hungary", url: "https://hungarianobserver.substack.com/p/the-price-of-a-vote-in-orbans-hungary", source: "Hungarian Observer" },
      // Hungarian sources
      { title: "Votes for money or food, chain voting – election fraud recorded", url: "https://english.atlatszo.hu/2022/04/06/votes-for-money-or-food-chain-voting-election-fraud-recorded-across-the-country/", source: "Átlátszó (2022)" },
      { title: "A szavazat ára - dokumentumfilm a szavazatvásárlásról", url: "https://telex.hu/belfold/2026/03/26/de-akciokozosseg-a-szavazat-ara-dokumentumfilm-szavazatvasarlas", source: "Telex" },
      { title: "Szavazatvásárlás a legszegényebb településeken", url: "https://hvg.hu/itthon/20260326_szavazatvasarlas-fidesz-videk-a-szavazat-ara-dokumentumfilm-de-akciokozosseg-ebx", source: "HVG" },
      { title: "Szavazatvásárlás, szegénység, Fidesz", url: "https://nepszava.hu/3316879_szavazatvasarlas-szegenyseg-fidesz", source: "Népszava" },
    ]
  },
]

// Vote-gathering biases (additional votes not captured in domestic polls)
const voteGatheringFactors: Factor[] = [
  {
    id: "foreign-voting",
    nameKey: "foreignVoting",
    enabled: true,
    value: 1,
    maxValue: 5,
    minValue: -5,
    category: "vote-gathering",
    beneficiary: "bidirectional",
    references: [
      // International reports on dual system
      { title: "A Tale Of Two Diasporas: Hungarian Voters Abroad", url: "https://www.rferl.org/a/hungary-election-diaspora-orban-marki-zay/31712662.html", source: "RFE/RL" },
      { title: "OSCE/ODIHR Final Report 2022 - Out-of-country voting", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE" },
      { title: "Has voting rights become a tool for dividing the nation?", url: "https://balk.hu/en/2026/02/14/hataron-tuli-magyarok-szavazati-joga/", source: "BALK Magazine" },
      { title: "Discarded, Burnt Postal Ballots Found", url: "https://hungarytoday.hu/discarded-burnt-postal-ballots-scandals-postal-voting-hungary-fidesz-opposition-rmdsz/", source: "Hungary Today" },
      { title: "How Viktor Orbán Wins", url: "https://www.journalofdemocracy.org/articles/how-viktor-orban-wins/", source: "Journal of Democracy" },
      // Hungarian sources
      { title: "2022 választási eredmények", url: "https://www.valasztas.hu/ogy2022", source: "Nemzeti Választási Iroda" },
      { title: "Levélszavazat átvétele és leadása", url: "https://www.valasztas.hu/en/levelszavazat-atvetele-es-leadasa", source: "NVI" },
      { title: "Több százezer külföldön élőből 65 ezren jutnak el az urnákig", url: "https://telex.hu/valasztas-2022/2022/03/30/valasztas-kulfoldon-elok-65-ezer-valasztasi-torveny", source: "Telex" },
      { title: "Erdélyi határon túliak szavazata", url: "https://transtelex.ro/kozelet/2022/04/01/erdely-hataron-tuliak-szavazata-levelszavazat", source: "Transtelex" },
      { title: "Szavazás külföldről – TASZ útmutató", url: "https://tasz.hu/tudastar/szavazas-kulfoldrol/", source: "TASZ" },
    ]
  },
]

// Seat-conversion biases
const seatConversionFactors: Factor[] = [
  {
    id: "gerrymandering",
    nameKey: "gerrymandering",
    enabled: true,
    value: 4, // District boundaries favor Fidesz (~4 seats)
    maxValue: 12,
    minValue: 0,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      // Academic research
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" },
      { title: "Geography of the new electoral system Hungary", url: "https://www.researchgate.net/publication/280941629_Geography_of_the_new_electoral_system_and_changing_voting_patterns_in_Hungary", source: "ResearchGate" },
      // International reports
      { title: "Hungary 2022: Manipulated Elections", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "Hungary's Electoral System: Reforms, Gerrymandering", url: "https://en.unav.edu/en/web/global-affairs/hungary-s-electoral-system-reforms-gerrymandering-and-strategic-voting-in-2026", source: "University of Navarra" },
      // Hungarian sources
      { title: "A választókerületek egyenlőtlensége", url: "https://www.partizan.hu/post/hogyan-seg%C3%ADti-a-v%C3%A1laszt%C3%A1si-rendszer-a-fideszt-1-r%C3%A9sz", source: "Partizán" },
      { title: "A Fidesz tíz legnagyobb térképrajzolós bravúrja", url: "https://444.hu/2014/03/10/a-tiz-legelszabottabb-valasztokerulet", source: "444.hu" },
      { title: "A választókerületek átrajzolása a kormánypártoknak kedvezhet", url: "https://www.szabadeuropa.hu/a/a-valasztokeruletek-atrajzolasa-is-a-kormanypartoknak-kedvezhet/31708449.html", source: "Szabad Európa" },
      { title: "Gerrymandering Fidesz-módra", url: "https://magyarnarancs.hu/belpol/bekeritik-a-varost-272776", source: "Magyar Narancs" },
      { title: "Túljutalmazott győztes", url: "https://poltudszemle.hu/articles/tuljutalmazott-gyoztes/", source: "Politikatudományi Szemle (2024)" },
    ]
  },
  {
    id: "two-round",
    nameKey: "twoRound",
    enabled: true,
    value: 2, // Abolition of two-round voting (~2 seats)
    maxValue: 15,
    minValue: 0,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      // Academic research
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" },
      { title: "On the Way to Limited Competitiveness", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/spsr.12535", source: "Swiss Political Science Review (2023)" },
      { title: "The new Hungarian election system's beneficiaries", url: "http://cens.ceu.edu/sites/cens.ceu.edu/files/attachment/article/579/laszlo-thenewhungarianelectionsystemsbeneficiaries.pdf", source: "CEU CENS" },
      // International reports
      { title: "How Viktor Orbán Wins", url: "https://www.journalofdemocracy.org/articles/how-viktor-orban-wins/", source: "Journal of Democracy" },
      { title: "Hungary's Electoral System - IOG", url: "https://instituteofgeoeconomics.org/en/research/hungarys-electoral-system-constructing-a-system-favorable-to-the-governing-party-and-its-future-prospects/", source: "Institute of Geoeconomics" },
      { title: "OSW Hungary election analysis", url: "https://www.osw.waw.pl/en/publikacje/osw-commentary/2026-02-25/osw-update-hungary-election-no-2", source: "OSW Centre for Eastern Studies" },
    ]
  },
  {
    id: "minority-mp",
    nameKey: "minorityMp",
    enabled: true,
    value: 1,
    maxValue: 1,
    minValue: -1,
    category: "seat-conversion",
    beneficiary: "bidirectional",
    references: [
      // International reports
      { title: "Hungary 2022: Manipulated Elections - Minority mandates", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "How Viktor Orbán Wins", url: "https://www.journalofdemocracy.org/articles/how-viktor-orban-wins/", source: "Journal of Democracy" },
      { title: "Roma Parliamentary Representation in Hungary", url: "https://www.ecmi.de/infochannel/detail/ecmi-minorities-blog-how-to-lose-the-almost-guaranteed-representation-recent-developments-concerning-roma-parliamentary-representation-in-hungary", source: "ECMI" },
      // Hungarian sources
      { title: "What Will Happen to the German Mandate?", url: "https://hungarytoday.hu/what-will-happen-to-the-german-mandate/", source: "Hungary Today" },
      { title: "Orbán already secured a mandate in Parliament", url: "https://dailynewshungary.com/orban-already-secured-a-mandate-in-parliament/", source: "Daily News Hungary" },
      { title: "Only Fidesz – Minority Electoral Law in Hungary", url: "https://verfassungsblog.de/only-fidesz-electoral-law-in-hungary/", source: "Verfassungsblog" },
    ]
  },
  {
    id: "winner-compensation",
    nameKey: "winnerCompensation",
    enabled: true,
    value: 3, // Winner gets leftover votes (~3 seats)
    maxValue: 10,
    minValue: 2,
    category: "seat-conversion",
    beneficiary: "winner",
    references: [
      // Academic research
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" },
      { title: "Győzteskompenzáció hatása - CUB szakdolgozat", url: "https://szd.lib.uni-corvinus.hu/15460/", source: "Corvinus University (2022)" },
      // International reports
      { title: "Hungary's Electoral System - IOG Analysis", url: "https://instituteofgeoeconomics.org/en/research/hungarys-electoral-system-constructing-a-system-favorable-to-the-governing-party-and-its-future-prospects/", source: "Institute of Geoeconomics" },
      { title: "Elections in Hungary - Electoral Integrity Project", url: "https://www.electoralintegrityproject.com/eip-blog/2023/2/23/elections-in-hungary-free-and-fair-is-much-more-than-election-day", source: "Electoral Integrity Project" },
      // Hungarian sources
      { title: "Túljutalmazott győztes", url: "https://poltudszemle.hu/articles/tuljutalmazott-gyoztes/", source: "Politikatudományi Szemle (2024)" },
      { title: "Mi az a győzteskompenzáció?", url: "https://www.szavaz.at/rendszerek/vegyes/gyozteskompenzacio", source: "szavaz.at" },
      { title: "Külhoni állampolgárok és győzteskompenzáció elemzés", url: "https://pcblog.atlatszo.hu/2022/04/11/kulhoni-magyar-allampolgarok-nelkul-is-meglenne-a-ketharmad-a-gyoztes-tuljutalmazasa-nelkul-nem/", source: "Átlátszó PC Blog" },
    ]
  },
  {
    id: "parliament-size",
    nameKey: "parliamentSize",
    enabled: true,
    value: 2, // Smaller parliament amplifies winner effects (~2 seats)
    maxValue: 6,
    minValue: 1,
    category: "seat-conversion",
    beneficiary: "winner",
    references: [
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" },
      { title: "Electoral system of Hungary - Parliament size", url: "https://en.wikipedia.org/wiki/Electoral_system_of_Hungary", source: "Wikipedia" },
      { title: "Hungary's Electoral System - IOG", url: "https://instituteofgeoeconomics.org/en/research/hungarys-electoral-system-constructing-a-system-favorable-to-the-governing-party-and-its-future-prospects/", source: "Institute of Geoeconomics" },
    ]
  },
  {
    id: "electoral-weighting",
    nameKey: "electoralWeighting",
    enabled: true,
    value: 10, // SMD winner bonus from mixed system (since 1989)
    maxValue: 30,
    minValue: 0,
    category: "seat-conversion",
    beneficiary: "winner",
    isElectoralSystemBias: true, // Special flag: controls SMD winner bonus, not seat transfer
    references: [
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" },
      { title: "Electoral system of Hungary - Historical", url: "https://en.wikipedia.org/wiki/Electoral_system_of_Hungary", source: "Wikipedia" },
      { title: "On the Way to Limited Competitiveness", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/spsr.12535", source: "Swiss Political Science Review (2023)" },
    ]
  },
]

// Parliament visualization component with hemicycle layout
function ParliamentChart({ seats }: { seats: PartySeats }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate seat positions for exactly 199 seats in a proper half-circle
  // Uniform spacing between dots across all rows
  const seatPositions = useMemo(() => {
    const centerX = 280
    const centerY = 260
    const innerRadius = 60
    const outerRadius = 220
    const numRows = 7

    // Calculate radii for each row
    const radii: number[] = []
    for (let row = 0; row < numRows; row++) {
      radii.push(innerRadius + (outerRadius - innerRadius) * (row / (numRows - 1)))
    }

    // Calculate the spacing that gives us exactly 199 seats
    // Total arc length = π * (r1 + r2 + ... + r7)
    // seats = totalArcLength / spacing, so spacing = totalArcLength / 199
    const totalArcLength = radii.reduce((sum, r) => sum + Math.PI * r, 0)
    const dotSpacing = totalArcLength / TOTAL_SEATS

    // Calculate seats per row based on uniform spacing
    const seatsPerRow: number[] = radii.map(r => Math.round(Math.PI * r / dotSpacing))

    // Adjust to ensure exactly 199 total
    let total = seatsPerRow.reduce((a, b) => a + b, 0)
    while (total !== TOTAL_SEATS) {
      if (total > TOTAL_SEATS) {
        // Remove from largest row
        const maxIdx = seatsPerRow.indexOf(Math.max(...seatsPerRow))
        seatsPerRow[maxIdx]--
        total--
      } else {
        // Add to smallest row
        const minIdx = seatsPerRow.indexOf(Math.min(...seatsPerRow))
        seatsPerRow[minIdx]++
        total++
      }
    }

    const positions: { x: number; y: number; angle: number }[] = []

    for (let row = 0; row < numRows; row++) {
      const radius = radii[row]
      const seatsInThisRow = seatsPerRow[row]

      for (let i = 0; i < seatsInThisRow; i++) {
        // Distribute evenly across the semicircle (π to 0)
        const angle = Math.PI - (Math.PI * (i + 0.5)) / seatsInThisRow
        const x = centerX + radius * Math.cos(angle)
        const y = centerY - radius * Math.sin(angle)
        positions.push({ x, y, angle })
      }
    }

    // Sort by angle (left to right = π to 0) for radial coloring
    positions.sort((a, b) => b.angle - a.angle)

    return positions
  }, [])

  // Assign colors based on sorted (radial) order
  const seatColors = useMemo(() => {
    const colors: string[] = []
    for (let i = 0; i < seats.tisza; i++) colors.push(PARTY_COLORS.tisza)
    for (let i = 0; i < seats.fidesz; i++) colors.push(PARTY_COLORS.fidesz)
    for (let i = 0; i < seats.smallParty; i++) colors.push(PARTY_COLORS.smallParty)
    while (colors.length < TOTAL_SEATS) colors.push(PARTY_COLORS.other)
    return colors
  }, [seats.tisza, seats.fidesz, seats.smallParty])

  if (!mounted) {
    return <div className="w-full h-[280px]" />
  }

  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 560 280" className="w-full max-w-lg" suppressHydrationWarning>
        {seatPositions.map((pos, i) => (
          <motion.circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={7}
            fill={seatColors[i] || PARTY_COLORS.other}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.002, duration: 0.3 }}
          />
        ))}
      </svg>
    </div>
  )
}

// Party legend component
function PartyLegend({ seats, lang }: { seats: PartySeats; lang: Language }) {
  const smallPartyName = lang === "hu" ? "Kis párt (5%+)" : "Small party (5%+)"
  const parties = [
    { name: "Tisza", seats: seats.tisza, color: "bg-tisza" },
    { name: "Fidesz", seats: seats.fidesz, color: "bg-fidesz" },
    { name: smallPartyName, seats: seats.smallParty, color: "bg-smallParty" },
  ]

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {parties.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${p.color}`} />
          <span className="text-2xl font-bold">{p.seats}</span>
          <span className="text-xs text-muted-foreground">{p.name}</span>
        </div>
      ))}
    </div>
  )
}

// Seat progress bar component
function SeatBar({ seats, t }: { seats: PartySeats; t: typeof translations.hu }) {
  const majority = 100
  const twoThirds = 133

  return (
    <div className="space-y-3">
      <div className="flex gap-1 text-xs text-muted-foreground">
        <span>Fidesz: {seats.fidesz}/{TOTAL_SEATS}</span>
        <span className="ml-auto">Tisza: {seats.tisza}/{TOTAL_SEATS}</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden bg-secondary">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: PARTY_COLORS.fidesz }}
          initial={{ width: 0 }}
          animate={{ width: `${(seats.fidesz / TOTAL_SEATS) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.div
          className="absolute right-0 top-0 h-full rounded-full"
          style={{ backgroundColor: PARTY_COLORS.tisza }}
          initial={{ width: 0 }}
          animate={{ width: `${(seats.tisza / TOTAL_SEATS) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <div className="relative flex text-[10px] text-muted-foreground font-medium">
        <span>0</span>
        <span className="absolute" style={{ left: `${((TOTAL_SEATS - twoThirds) / TOTAL_SEATS) * 100}%`, transform: "translateX(-50%)" }}>
          {twoThirds} ({t.twoThirds})
        </span>
        <span className="absolute" style={{ left: `${(majority / TOTAL_SEATS) * 100}%`, transform: "translateX(-50%)" }}>
          {majority} ({t.majority})
        </span>
        <span className="absolute" style={{ left: `${(twoThirds / TOTAL_SEATS) * 100}%`, transform: "translateX(-50%)" }}>
          {twoThirds} ({t.twoThirds})
        </span>
        <span className="ml-auto">{TOTAL_SEATS}</span>
      </div>
    </div>
  )
}

// Flow diagram component
function FlowDiagram({
  fairVotes,
  effectiveVotes,
  displayedVotes,
  seats,
  hasDisabledVoteBias,
  t
}: {
  fairVotes: VoteShare
  effectiveVotes: VoteShare
  displayedVotes: VoteShare
  seats: PartySeats
  hasDisabledVoteBias: boolean
  t: typeof translations.hu
}) {
  // Show strikethrough on middle step when vote biases are disabled and values differ
  const valuesChanged = hasDisabledVoteBias && (
    displayedVotes.fidesz !== Math.round(effectiveVotes.fidesz) ||
    displayedVotes.tisza !== Math.round(effectiveVotes.tisza) ||
    displayedVotes.smallParty !== Math.round(effectiveVotes.smallParty)
  )

  const steps = [
    {
      icon: Monitor,
      label: t.fairPreference,
      tooltip: null,
      tisza: `${Math.round(fairVotes.tisza)}%`,
      fidesz: `${Math.round(fairVotes.fidesz)}%`,
      smallParty: `${Math.round(fairVotes.smallParty)}%`,
      highlight: false,
      showStrikethrough: false,
      originalTisza: 0,
      originalFidesz: 0,
      originalSmallParty: 0,
    },
    {
      icon: Vote,
      label: hasDisabledVoteBias ? t.measuredPreference + " *" : t.measuredPreference,
      tooltip: t.measuredPreferenceTooltip,
      tisza: `${Math.round(effectiveVotes.tisza)}%`,
      fidesz: `${Math.round(effectiveVotes.fidesz)}%`,
      smallParty: `${Math.round(effectiveVotes.smallParty)}%`,
      highlight: hasDisabledVoteBias,
      showStrikethrough: valuesChanged,
      originalTisza: displayedVotes.tisza,
      originalFidesz: displayedVotes.fidesz,
      originalSmallParty: displayedVotes.smallParty,
    },
    {
      icon: Landmark,
      label: t.finalSeats,
      tooltip: null,
      tisza: `${seats.tisza}`,
      fidesz: `${seats.fidesz}`,
      smallParty: `${seats.smallParty}`,
      highlight: false,
      showStrikethrough: false,
      originalTisza: 0,
      originalFidesz: 0,
      originalSmallParty: 0,
      showVotePercent: true,
      votePercentTisza: Math.round(seats.tisza / 199 * 100),
      votePercentFidesz: Math.round(seats.fidesz / 199 * 100),
      votePercentSmallParty: Math.round(seats.smallParty / 199 * 100),
    },
  ]

  const arrows = [
    `${t.opinionFormingBiases} (${t.opinionFormingDesc})`,
    `${t.voteGatheringBiases} + ${t.seatConversionBiases} (${t.voteGatheringDesc}, ${t.seatConversionDesc})`,
  ]

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {t.transformationFlow}
      </h3>
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className={`glass-card p-4 ${step.highlight ? 'ring-1 ring-accent/50' : ''}`}>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <step.icon className="w-4 h-4" />
              <span className="font-medium">{step.label}</span>
              {step.tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{step.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-tisza" />
                <span className="text-lg font-bold">{step.tisza}</span>
                {step.showStrikethrough && step.originalTisza !== Math.round(effectiveVotes.tisza) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalTisza}%</span>
                )}
                {step.showVotePercent && (
                  <span className="text-xs text-muted-foreground">({step.votePercentTisza}%)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-fidesz" />
                <span className="text-lg font-bold">{step.fidesz}</span>
                {step.showStrikethrough && step.originalFidesz !== Math.round(effectiveVotes.fidesz) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalFidesz}%</span>
                )}
                {step.showVotePercent && (
                  <span className="text-xs text-muted-foreground">({step.votePercentFidesz}%)</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-smallParty" />
                <span className="text-lg font-bold">{step.smallParty}</span>
                {step.showStrikethrough && step.originalSmallParty !== Math.round(effectiveVotes.smallParty) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalSmallParty}%</span>
                )}
                {step.showVotePercent && (
                  <span className="text-xs text-muted-foreground">({step.votePercentSmallParty}%)</span>
                )}
              </div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center gap-2 py-2 pl-4 text-[11px] text-muted-foreground">
              <ArrowDown className="w-3 h-3" />
              <span>+ {arrows[i]}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Poll sliders component
function PollSliders({
  displayedVotes,
  fairVotes,
  enabledBias,
  onChange,
  t,
  lang
}: {
  displayedVotes: VoteShare
  fairVotes: VoteShare
  enabledBias: number
  onChange: (party: keyof VoteShare, value: number) => void
  t: typeof translations.hu
  lang: Language
}) {
  const smallPartyAboveThreshold = displayedVotes.smallParty >= 5
  const smallPartyName = lang === "hu"
    ? (smallPartyAboveThreshold ? "Kis párt (5%+)" : "Kis párt (küszöb alatt)")
    : (smallPartyAboveThreshold ? "Small party (5%+)" : "Small party (below threshold)")
  const parties = [
    { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
    { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
    { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 3, max: 20 },
  ]

  const total = displayedVotes.tisza + displayedVotes.fidesz + displayedVotes.smallParty
  const others = 100 - total

  // Bias label text
  const biasLabel = lang === "hu" ? "torzítás" : "bias"

  return (
    <div className="space-y-6">
      {parties.map((party) => {
        const displayedValue = Math.round(displayedVotes[party.key])
        const fairValue = Math.round(fairVotes[party.key])
        const hasBias = party.key === 'fidesz' && enabledBias > 0
        const biasAmount = hasBias ? Math.round(enabledBias) : 0

        // Calculate slider fill percentages
        const fillPercent = ((displayedValue - party.min) / (party.max - party.min)) * 100
        // For Fidesz with bias: show fair portion in party color, bias portion in accent color
        const fairFillPercent = hasBias
          ? ((fairValue - party.min) / (party.max - party.min)) * 100
          : fillPercent

        return (
          <motion.div
            key={party.key}
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: party.color }}
                />
                <span className="text-sm font-medium">{party.name}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">{displayedValue}%</span>
                {hasBias && biasAmount > 0 && (
                  <span className="text-xs text-accent ml-1.5 font-medium">
                    (+{biasAmount}% {biasLabel})
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min={party.min}
                max={party.max}
                value={displayedValue}
                onChange={(e) => onChange(party.key, parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: hasBias
                    ? `linear-gradient(to right, ${party.color} ${fairFillPercent}%, hsl(var(--accent)) ${fairFillPercent}%, hsl(var(--accent)) ${fillPercent}%, hsl(220, 15%, 18%) ${fillPercent}%)`
                    : `linear-gradient(to right, ${party.color} ${fillPercent}%, hsl(220, 15%, 18%) ${fillPercent}%)`,
                }}
              />
            </div>
          </motion.div>
        )
      })}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        <span className="font-medium">{lang === "hu" ? "Egyéb pártok" : "Other parties"}: {others}%</span>
        <span className="ml-1">– {t.othersNote}</span>
      </div>
    </div>
  )
}

// Bias controls component
function BiasControls({
  factors,
  winner,
  lang,
  onToggle,
  onChange
}: {
  factors: Factor[]
  winner: "tisza" | "fidesz"
  lang: Language
  onToggle: (id: string) => void
  onChange: (id: string, value: number) => void
}) {
  const t = translations[lang]

  return (
    <div className="space-y-3">
      {factors.map((factor, i) => {
        const factorT = t.factors[factor.nameKey as keyof typeof t.factors]
        const isWinnerFactor = factor.beneficiary === "winner"
        const isBidirectional = factor.beneficiary === "bidirectional"
        // For bidirectional: positive = Fidesz, negative = Tisza
        const actualBeneficiary = isBidirectional
          ? (factor.value >= 0 ? "fidesz" : "tisza")
          : (isWinnerFactor ? winner : "fidesz")
        const beneficiaryColor = actualBeneficiary === "tisza" ? PARTY_COLORS.tisza : PARTY_COLORS.fidesz
        const beneficiaryName = actualBeneficiary === "tisza" ? "Tisza" : "Fidesz"
        // Opinion-forming and vote-gathering biases affect vote percentages, seat-conversion affects seats
        // Electoral system bias is percentage-based (scales with margin)
        const unit = factor.isElectoralSystemBias ? "%" : (factor.category === "seat-conversion" ? ` ${t.seats}` : "%")
        const displayValue = isBidirectional ? Math.abs(factor.value) : factor.value

        return (
          <motion.div
            key={factor.id}
            className="glass-card p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{factorT.name}</span>
                {isWinnerFactor && (
                  <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {t.helpsWinner}
                  </Badge>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{factorT.description}</p>
                      {factor.references.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground mb-1">{t.sources}</p>
                          {factor.references.map((ref, i) => (
                            <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                              {ref.source} <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          ))}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={factor.enabled}
                onCheckedChange={() => onToggle(factor.id)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: beneficiaryColor }}
                    animate={{ width: factor.enabled ? `${((factor.value - factor.minValue) / (factor.maxValue - factor.minValue)) * 100}%` : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              {factor.value === 0 ? (
                <span className="text-xs font-semibold text-muted-foreground">0{unit}</span>
              ) : (
                <span className="text-xs font-semibold" style={{ color: beneficiaryColor }}>
                  +{displayValue}{unit} {beneficiaryName}
                </span>
              )}
            </div>
            {factor.enabled && factor.maxValue !== factor.minValue && (
              <div className="mt-3">
                <Slider
                  value={[factor.value]}
                  onValueChange={([v]) => onChange(factor.id, v)}
                  min={factor.minValue}
                  max={factor.maxValue}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

// Tour panel component for guided onboarding
function TourPanel({
  currentPage,
  totalPages,
  onNext,
  onBack,
  onSkip,
  onFinish,
  t,
  lang,
  // Content props
  displayedVotes,
  fairVotes,
  enabledBias,
  onPollChange,
  opinionFactors,
  voteFactors,
  seatFactors,
  winner,
  onOpinionFactorToggle,
  onOpinionFactorChange,
  onVoteFactorToggle,
  onVoteFactorChange,
  onSeatFactorToggle,
  onSeatFactorChange,
}: {
  currentPage: number
  totalPages: number
  onNext: () => void
  onBack: () => void
  onSkip: () => void
  onFinish: () => void
  t: typeof translations.hu
  lang: Language
  displayedVotes: VoteShare
  fairVotes: VoteShare
  enabledBias: number
  onPollChange: (party: keyof VoteShare, value: number) => void
  opinionFactors: Factor[]
  voteFactors: Factor[]
  seatFactors: Factor[]
  winner: "tisza" | "fidesz"
  onOpinionFactorToggle: (id: string) => void
  onOpinionFactorChange: (id: string, value: number) => void
  onVoteFactorToggle: (id: string) => void
  onVoteFactorChange: (id: string, value: number) => void
  onSeatFactorToggle: (id: string) => void
  onSeatFactorChange: (id: string, value: number) => void
}) {
  const isLastPage = currentPage === totalPages - 1
  const isFirstPage = currentPage === 0

  // Calculate which bias we're showing (if any)
  // Page 0: Intro, Page 1: Context, Page 2: How it works, Page 3: Polls, Pages 4+: Biases (opinion + vote + seat)
  const allFactors = [...opinionFactors, ...voteFactors, ...seatFactors]
  const biasIndex = currentPage - 4
  const currentFactor = biasIndex >= 0 ? allFactors[biasIndex] : null
  const isOpinionFactor = currentFactor ? opinionFactors.some(f => f.id === currentFactor.id) : false
  const isVoteFactor = currentFactor ? voteFactors.some(f => f.id === currentFactor.id) : false

  const renderContent = () => {
    // Page 0: Introduction
    if (currentPage === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-primary" style={{ transform: 'rotate(-12deg)' }} />
            </div>
            <h2 className="text-2xl font-bold">{t.tour.introTitle}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t.tour.introText}
          </p>
        </div>
      )
    }

    // Page 1: Context / History
    if (currentPage === 1) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold mb-2">{t.tour.contextTitle}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {t.tour.contextText}
          </p>
        </div>
      )
    }

    // Page 2: How it works
    if (currentPage === 2) {
      return (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold mb-2">{t.tour.howItWorksTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.tour.howItWorksText}</p>
          </div>

          <ul className="space-y-2">
            {t.tour.howItWorksFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline mr-2 text-primary" />
              {t.tour.howItWorksNote}
            </p>
          </div>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Calculator className="w-4 h-4" />
              <span>{t.tour.methodologyTitle}</span>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="p-3 rounded-lg bg-card border border-border text-sm space-y-2">
                <p className="text-muted-foreground">{t.tour.methodologyText}</p>
                <a
                  href="https://taktikaiszavazas.hu/modszertan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.tour.methodologyLink}
                </a>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }

    // Page 3: Polls
    if (currentPage === 3) {
      const smallPartyAboveThreshold = displayedVotes.smallParty >= 5
      const smallPartyName = lang === "hu"
        ? (smallPartyAboveThreshold ? "Kis párt (5%+)" : "Kis párt (küszöb alatt)")
        : (smallPartyAboveThreshold ? "Small party (5%+)" : "Small party (below threshold)")
      const parties = [
        { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
        { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
        { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 3, max: 20 },
      ]

      // Bias label text
      const biasLabel = lang === "hu" ? "torzítás" : "bias"

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">{t.tour.pollsTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.tour.pollsText}</p>
          </div>

          <div className="space-y-5">
            {parties.map((party) => {
              const displayedValue = Math.round(displayedVotes[party.key])
              const fairValue = Math.round(fairVotes[party.key])
              const hasBias = party.key === 'fidesz' && enabledBias > 0
              const biasAmount = hasBias ? Math.round(enabledBias) : 0
              const fillPercent = ((displayedValue - party.min) / (party.max - party.min)) * 100
              const fairFillPercent = hasBias
                ? ((fairValue - party.min) / (party.max - party.min)) * 100
                : fillPercent

              return (
                <div key={party.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="text-sm font-medium">{party.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{displayedValue}%</span>
                      {hasBias && biasAmount > 0 && (
                        <span className="text-xs text-accent ml-1.5 font-medium">
                          (+{biasAmount}% {biasLabel})
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={party.min}
                    max={party.max}
                    value={displayedValue}
                    onChange={(e) => onPollChange(party.key, parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: hasBias
                        ? `linear-gradient(to right, ${party.color} ${fairFillPercent}%, hsl(var(--accent)) ${fairFillPercent}%, hsl(var(--accent)) ${fillPercent}%, hsl(220, 15%, 18%) ${fillPercent}%)`
                        : `linear-gradient(to right, ${party.color} ${fillPercent}%, hsl(220, 15%, 18%) ${fillPercent}%)`,
                    }}
                  />
                </div>
              )
            })}
          </div>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>{t.references}</span>
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              <a
                href="https://taktikaiszavazas.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">Taktikai Szavazás</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Közvéleménykutatások összesítése" : "Poll aggregator"}</p>
              </a>
              <a
                href="https://2026.kozvelemeny.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">Vox Populi</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Közvéleménykutatások aggregátora" : "Poll aggregator"}</p>
              </a>
              <a
                href="https://publicus.hu/blog/partok-tamogatottsaga-2026-marcius/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">Publicus</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Független közvéleménykutató" : "Independent pollster"}</p>
              </a>
              <a
                href="https://21kutatokozpont.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">21 Kutatóközpont</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Politikai elemzések és közvéleménykutatás" : "Political analysis and polling"}</p>
              </a>
              <a
                href="https://republikon.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">Republikon Intézet</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Független közvéleménykutató" : "Independent pollster"}</p>
              </a>
              <a
                href="https://median.hu/2026/03/27/a-ketharmad-kapujaban-a-tisza-ketparti-parlamentre-van-esely/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
              >
                <p className="font-medium">Medián</p>
                <p className="text-xs text-muted-foreground">{lang === "hu" ? "Független közvéleménykutató (1989 óta)" : "Independent pollster (since 1989)"}</p>
              </a>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )
    }

    // Pages 2+: Individual bias factors
    if (currentFactor) {
      const factorT = t.factors[currentFactor.nameKey as keyof typeof t.factors]
      const isWinnerFactor = currentFactor.beneficiary === "winner"
      const isBidirectional = currentFactor.beneficiary === "bidirectional"
      // For bidirectional: positive = Fidesz, negative = Tisza
      const actualBeneficiary = isBidirectional
        ? (currentFactor.value >= 0 ? "fidesz" : "tisza")
        : (isWinnerFactor ? winner : "fidesz")
      const beneficiaryColor = actualBeneficiary === "tisza" ? PARTY_COLORS.tisza : PARTY_COLORS.fidesz
      const beneficiaryName = actualBeneficiary === "tisza" ? "Tisza" : "Fidesz"
      // Electoral system bias is percentage-based (scales with margin)
      const unit = currentFactor.isElectoralSystemBias ? "%" : (currentFactor.category === "seat-conversion" ? ` ${t.seats}` : "%")
      const displayValue = isBidirectional ? Math.abs(currentFactor.value) : currentFactor.value

      const handleToggle = isOpinionFactor
        ? onOpinionFactorToggle
        : (isVoteFactor ? onVoteFactorToggle : onSeatFactorToggle)
      const handleChange = isOpinionFactor
        ? onOpinionFactorChange
        : (isVoteFactor ? onVoteFactorChange : onSeatFactorChange)

      return (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{factorT.name}</h2>
              {isWinnerFactor && (
                <Badge variant="outline" className="text-[10px] gap-0.5 px-1.5 py-0">
                  <TrendingUp className="h-2.5 w-2.5" />
                  {t.helpsWinner}
                </Badge>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentFactor.category === "opinion-forming"
                ? t.opinionFormingBiases
                : (currentFactor.category === "vote-gathering" ? t.voteGatheringBiases : t.seatConversionBiases)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {factorT.description}
          </p>

          {/* Adjustable note */}
          {currentFactor.maxValue !== currentFactor.minValue && (
            <p className="text-xs text-muted-foreground italic">
              {t.tour.adjustableNote}
            </p>
          )}

          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{lang === "hu" ? "Aktív" : "Active"}</span>
              <Switch
                checked={currentFactor.enabled}
                onCheckedChange={() => handleToggle(currentFactor.id)}
              />
            </div>

            {currentFactor.maxValue !== currentFactor.minValue && (
              <div className={`space-y-2 ${!currentFactor.enabled ? "opacity-40" : ""}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{lang === "hu" ? "Hatás becsült mértéke" : "Estimated effect magnitude"}</span>
                  {currentFactor.value === 0 ? (
                    <span className="font-semibold text-muted-foreground">0{unit}</span>
                  ) : (
                    <span className="font-semibold" style={{ color: currentFactor.enabled ? beneficiaryColor : undefined }}>
                      +{displayValue}{unit} {beneficiaryName}
                    </span>
                  )}
                </div>
                <Slider
                  value={[currentFactor.value]}
                  onValueChange={([v]) => handleChange(currentFactor.id, v)}
                  min={currentFactor.minValue}
                  max={currentFactor.maxValue}
                  step={1}
                  className="w-full"
                  disabled={!currentFactor.enabled}
                />
              </div>
            )}

            {currentFactor.maxValue === currentFactor.minValue && (
              <div className={`text-sm ${!currentFactor.enabled ? "opacity-40" : ""}`}>
                <span className="text-muted-foreground">{lang === "hu" ? "Fix hatás:" : "Fixed effect:"} </span>
                {currentFactor.value === 0 ? (
                  <span className="font-semibold text-muted-foreground">0{unit}</span>
                ) : (
                  <span className="font-semibold" style={{ color: currentFactor.enabled ? beneficiaryColor : undefined }}>
                    +{displayValue}{unit} {beneficiaryName}
                  </span>
                )}
              </div>
            )}
          </div>

          {currentFactor.references.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>{t.references}</span>
                <ChevronDown className="w-4 h-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 space-y-2">
                {currentFactor.references.map((ref, i) => (
                  <a
                    key={i}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors text-sm"
                  >
                    <p className="font-medium">{ref.title}</p>
                    <p className="text-xs text-muted-foreground">{ref.source}</p>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      {/* Progress indicator with navigation */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-muted-foreground">
          {currentPage + 1} {t.tour.stepOf} {totalPages}
        </span>
        <div className="flex items-center gap-2">
          {/* Back button */}
          {!isFirstPage && (
            <button
              onClick={onBack}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t.tour.back}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {/* Dots */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentPage ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          {/* Forward button */}
          {!isLastPage && currentPage > 0 && (
            <button
              onClick={onNext}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t.tour.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation - sticky on mobile for easy access while scrolling */}
      <div className="sticky bottom-0 left-0 right-0 mt-4 pt-4 pb-2 border-t border-border flex items-center justify-between bg-card/95 backdrop-blur-sm md:relative md:bg-transparent md:backdrop-blur-none md:mt-6 md:pb-0">
        <button
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <SkipForward className="w-4 h-4" />
          {t.tour.skip}
        </button>

        <button
          onClick={isLastPage ? onFinish : onNext}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {isFirstPage ? (
            <>
              <Play className="w-4 h-4" />
              {t.tour.startExploring}
            </>
          ) : isLastPage ? (
            t.tour.finish
          ) : (
            <>
              {t.tour.next}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// Main component
export function ParliamentVisualization() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize language from URL query parameter, default to "hu"
  const initialLang = (searchParams.get("lang") === "en" ? "en" : "hu") as Language
  const [lang, setLang] = useState<Language>(initialLang)

  const [opinionFactors, setOpinionFactors] = useState<Factor[]>(opinionFormingFactors)
  const [voteFactors, setVoteFactors] = useState<Factor[]>(voteGatheringFactors)
  const [seatFactors, setSeatFactors] = useState<Factor[]>(seatConversionFactors)
  const [showReferences, setShowReferences] = useState(false)

  // Tour state
  const [isTourMode, setIsTourMode] = useState(true)
  const [tourPage, setTourPage] = useState(0)

  // Total tour pages: intro + context + how it works + polls + all biases (opinion + vote + seat)
  const totalTourPages = 4 + opinionFactors.length + voteFactors.length + seatFactors.length

  const t = translations[lang]

  // Update URL when language changes
  const handleLanguageChange = useCallback((newLang: Language) => {
    setLang(newLang)
    const params = new URLSearchParams(searchParams.toString())
    if (newLang === "hu") {
      params.delete("lang") // Default language, no need to show in URL
    } else {
      params.set("lang", newLang)
    }
    const queryString = params.toString()
    router.replace(queryString ? `?${queryString}` : window.location.pathname, { scroll: false })
  }, [searchParams, router])

  // Calculate combined bias using diminishing returns formula
  // Opinion biases affect overlapping voter populations, so they shouldn't be simply additive
  // Formula: combined = 1 - (1-a)(1-b)(1-c)... for effects a, b, c as decimals
  const calculateDiminishingBias = useCallback((biasValues: number[]): number => {
    if (biasValues.length === 0) return 0
    // Convert percentages to decimals, apply diminishing returns, convert back
    const product = biasValues.reduce((acc, bias) => acc * (1 - bias / 100), 1)
    return (1 - product) * 100
  }, [])

  // Calculate enabled bias total (only ENABLED opinion factors)
  const enabledOpinionBias = useMemo(() => {
    const enabledValues = opinionFactors.filter(f => f.enabled).map(f => f.value)
    return calculateDiminishingBias(enabledValues)
  }, [opinionFactors, calculateDiminishingBias])

  // Calculate total bias (ALL opinion factors, enabled or not)
  const totalOpinionBias = useMemo(() => {
    const allValues = opinionFactors.map(f => f.value)
    return calculateDiminishingBias(allValues)
  }, [opinionFactors, calculateDiminishingBias])

  // Fair base votes: the "true" preference without any opinion bias
  // This is what we store and modify when user adjusts sliders
  // Initialize by calculating fair base from default measured votes
  const [fairBaseVotes, setFairBaseVotes] = useState<VoteShare>(() => {
    const initialEnabledBias = calculateDiminishingBias(
      opinionFormingFactors.filter(f => f.enabled).map(f => f.value)
    )
    return calculateFairBaseFromMeasured(DEFAULT_MEASURED_VOTES, initialEnabledBias)
  })

  // Displayed votes (what polls show) = fair base + enabled opinion biases for Fidesz
  // When biases are toggled, Fidesz displayed value changes automatically
  // Tisza and smallParty displayed values equal their fair base (no redistribution)
  const displayedVotes = useMemo((): VoteShare => {
    return {
      tisza: fairBaseVotes.tisza,
      fidesz: fairBaseVotes.fidesz + enabledOpinionBias,
      smallParty: fairBaseVotes.smallParty,
    }
  }, [fairBaseVotes, enabledOpinionBias])

  // Fair votes for display: this is what preference would be without ANY opinion bias
  // (same as fairBaseVotes, kept for compatibility with existing UI)
  const fairVotes = fairBaseVotes
  // Calculate EFFECTIVE votes for seat calculation
  // Uses displayedVotes (poll values with enabled opinion biases)
  // Plus foreign votes when enabled (these are NOT included in polls)
  const effectiveVotes = useMemo((): VoteShare => {
    let adjustedFidesz = displayedVotes.fidesz
    let adjustedTisza = displayedVotes.tisza

    // Process foreign votes (ADD when ENABLED - these are not in polls!)
    // Bidirectional biases: positive = Fidesz advantage, negative = Tisza advantage
    voteFactors.filter(f => f.enabled).forEach(f => {
      if (f.beneficiary === "bidirectional") {
        // Positive = Fidesz, negative = Tisza
        if (f.value > 0) {
          adjustedFidesz += f.value
        } else {
          adjustedTisza += Math.abs(f.value)
        }
      } else {
        // Standard Fidesz bias
        adjustedFidesz += f.value
      }
    })

    return {
      tisza: adjustedTisza,
      fidesz: adjustedFidesz,
      smallParty: displayedVotes.smallParty,
    }
  }, [displayedVotes, voteFactors])

  const winner: "tisza" | "fidesz" = effectiveVotes.tisza >= effectiveVotes.fidesz ? "tisza" : "fidesz"

  // Check if small party passes the 5% parliamentary threshold
  const smallPartyPassesThreshold = displayedVotes.smallParty >= 5

  // Calculate base seats using proper Hungarian mixed system model
  // Based on taktikaiszavazas.hu methodology:
  // - 106 SMD seats: Winner-take-all, small parties get ~0 (can't win plurality)
  // - 93 list seats: D'Hondt proportional distribution among parties above 5%
  // - Fidesz has ~1% SMD overperformance vs list votes
  // - Electoral system bias (since 1989) controls the winner-take-all effect in SMD
  const proportionalSeats = useMemo((): PartySeats => {
    const qualifyingSmallParty = smallPartyPassesThreshold ? effectiveVotes.smallParty : 0
    const majorPartyTotal = effectiveVotes.tisza + effectiveVotes.fidesz

    if (majorPartyTotal === 0) return { tisza: 0, fidesz: 0, smallParty: 0 }

    // Get the electoral system bias (1989) factor - controls SMD winner bonus
    const electoralWeightingFactor = seatFactors.find(f => f.isElectoralSystemBias)
    const electoralSystemBias = electoralWeightingFactor?.enabled
      ? electoralWeightingFactor.value / 100 // Convert 0-30 to 0.00-0.30
      : 0

    // === SMD SEATS (106) ===
    // Small parties get 0 SMD seats (they can't win plurality in any district)
    // Major parties split SMD seats based on relative strength
    // When electoral bias = 0, seats are roughly proportional between major parties
    // When electoral bias > 0, winner gets bonus seats (winner-take-all effect)

    const tiszaShare = effectiveVotes.tisza / majorPartyTotal
    const fideszShare = effectiveVotes.fidesz / majorPartyTotal

    // SMD bonus for Fidesz (~1% overperformance in SMD)
    const smdFideszBonus = 0.01
    const adjustedFideszSmdShare = Math.min(1, fideszShare + smdFideszBonus)
    const adjustedTiszaSmdShare = 1 - adjustedFideszSmdShare

    // Electoral system bias: winner-take-all effect from mixed system
    // This is the structural advantage for whoever leads (since 1989)
    // Scales with the margin between parties and the bias level
    const margin = Math.abs(adjustedFideszSmdShare - adjustedTiszaSmdShare)
    const winnerBonus = margin * electoralSystemBias * 2 // Scales with margin and bias level

    let smdTisza: number, smdFidesz: number
    if (adjustedTiszaSmdShare > adjustedFideszSmdShare) {
      smdTisza = Math.round(SMD_SEATS * (adjustedTiszaSmdShare + winnerBonus))
      smdFidesz = SMD_SEATS - smdTisza
    } else {
      smdFidesz = Math.round(SMD_SEATS * (adjustedFideszSmdShare + winnerBonus))
      smdTisza = SMD_SEATS - smdFidesz
    }

    // Clamp to valid range
    smdTisza = Math.max(0, Math.min(SMD_SEATS, smdTisza))
    smdFidesz = SMD_SEATS - smdTisza

    // === LIST SEATS (93) ===
    // Proportional distribution using D'Hondt among parties above 5%
    // Small parties only get list seats

    // Proper D'Hondt allocation: allocate seats one by one, always giving to highest quotient
    const dHondtAllocate = (votes: { tisza: number, fidesz: number, smallParty: number }, seats: number) => {
      const result = { tisza: 0, fidesz: 0, smallParty: 0 }

      for (let i = 0; i < seats; i++) {
        // Calculate current quotient for each party: votes / (seats_already_won + 1)
        const quotients = [
          { party: 'tisza' as const, value: votes.tisza / (result.tisza + 1) },
          { party: 'fidesz' as const, value: votes.fidesz / (result.fidesz + 1) },
        ]
        if (qualifyingSmallParty > 0) {
          quotients.push({ party: 'smallParty' as const, value: votes.smallParty / (result.smallParty + 1) })
        }

        // Find party with highest quotient and give them the seat
        const winner = quotients.reduce((max, curr) => curr.value > max.value ? curr : max)
        result[winner.party]++
      }

      return result
    }

    const listSeats = dHondtAllocate(
      { tisza: effectiveVotes.tisza, fidesz: effectiveVotes.fidesz, smallParty: qualifyingSmallParty },
      LIST_SEATS
    )

    return {
      tisza: smdTisza + listSeats.tisza,
      fidesz: smdFidesz + listSeats.fidesz,
      smallParty: listSeats.smallParty, // Small parties only get list seats
    }
  }, [effectiveVotes, smallPartyPassesThreshold, seatFactors])

  const finalSeats = useMemo((): PartySeats => {
    let fideszBias = 0
    let winnerBias = 0

    // Electoral system bias is handled in proportionalSeats (SMD winner bonus)
    // Only count other seat transfer factors here
    seatFactors.filter(f => f.enabled && !f.isElectoralSystemBias).forEach(f => {
      if (f.beneficiary === "fidesz") fideszBias += f.value
      else winnerBias += f.value
    })

    let tisza = proportionalSeats.tisza
    let fidesz = proportionalSeats.fidesz
    let smallParty = proportionalSeats.smallParty

    // Fidesz bias: transfer seats from Tisza to Fidesz
    const actualFideszBias = Math.min(fideszBias, tisza) // Can't take more than Tisza has
    fidesz += actualFideszBias
    tisza -= actualFideszBias

    // Winner bias: transfer seats from loser to winner
    if (winner === "tisza") {
      const actualWinnerBias = Math.min(winnerBias, fidesz)
      tisza += actualWinnerBias
      fidesz -= actualWinnerBias
    } else {
      const actualWinnerBias = Math.min(winnerBias, tisza)
      fidesz += actualWinnerBias
      tisza -= actualWinnerBias
    }

    // Ensure no negative values and total equals 199
    tisza = Math.max(0, tisza)
    fidesz = Math.max(0, fidesz)
    smallParty = Math.max(0, smallParty)

    // Adjust if total exceeds 199 (shouldn't happen with proper bias logic)
    const total = tisza + fidesz + smallParty
    if (total > TOTAL_SEATS) {
      // Reduce the largest party
      const excess = total - TOTAL_SEATS
      if (fidesz >= tisza) fidesz -= excess
      else tisza -= excess
    }

    return { tisza, fidesz, smallParty }
  }, [proportionalSeats, seatFactors, winner])

  // When user changes poll slider, update fairBaseVotes
  // For Fidesz: displayed = fairBase + enabledBias, so fairBase = displayed - enabledBias
  // For others: fairBase = displayed directly
  const handlePollChange = useCallback((party: keyof VoteShare, value: number) => {
    if (party === 'fidesz') {
      // Fidesz slider shows displayed (biased) value, so we need to back-calculate fair base
      setFairBaseVotes(prev => ({ ...prev, fidesz: value - enabledOpinionBias }))
    } else {
      // Tisza and smallParty: fair base equals displayed value
      setFairBaseVotes(prev => ({ ...prev, [party]: value }))
    }
  }, [enabledOpinionBias])

  const handleOpinionFactorToggle = useCallback((id: string) => {
    setOpinionFactors(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }, [])

  const handleOpinionFactorChange = useCallback((id: string, value: number) => {
    setOpinionFactors(prev => prev.map(f => f.id === id ? { ...f, value } : f))
  }, [])

  const handleVoteFactorToggle = useCallback((id: string) => {
    setVoteFactors(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }, [])

  const handleVoteFactorChange = useCallback((id: string, value: number) => {
    setVoteFactors(prev => prev.map(f => f.id === id ? { ...f, value } : f))
  }, [])

  const handleSeatFactorToggle = useCallback((id: string) => {
    setSeatFactors(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }, [])

  const handleSeatFactorChange = useCallback((id: string, value: number) => {
    setSeatFactors(prev => prev.map(f => f.id === id ? { ...f, value } : f))
  }, [])

  // Tour navigation
  const handleTourNext = useCallback(() => {
    setTourPage(prev => Math.min(prev + 1, totalTourPages - 1))
  }, [totalTourPages])

  const handleTourBack = useCallback(() => {
    setTourPage(prev => Math.max(prev - 1, 0))
  }, [])

  const handleTourSkip = useCallback(() => {
    setIsTourMode(false)
  }, [])

  const handleTourFinish = useCallback(() => {
    setIsTourMode(false)
  }, [])

  const handleRestartTour = useCallback(() => {
    setTourPage(0)
    setIsTourMode(true)
  }, [])

  const allReferences = useMemo(() => {
    const refs = new Map<string, { title: string; url: string; source: string }>()
    ;[...opinionFactors, ...voteFactors, ...seatFactors].forEach(f => {
      f.references.forEach(r => refs.set(r.url, r))
    })
    return Array.from(refs.values())
  }, [opinionFactors, voteFactors, seatFactors])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Landmark className="w-5 h-5" style={{ transform: 'rotate(-12deg)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest">{t.headerLabel}</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <button
              onClick={() => handleLanguageChange(lang === "hu" ? "en" : "hu")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === "hu" ? "English" : "Magyar"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        className="container max-w-6xl mx-auto px-4 pt-16 pb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t.title}{" "}
          <span className="text-accent">{t.titleAccent}</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          {t.subtitle}
        </p>
      </motion.section>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 pb-20">
        {isTourMode ? (
          /* Tour Mode Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tour Panel - on top on mobile, right on desktop */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-4">
                <TourPanel
                  currentPage={tourPage}
                  totalPages={totalTourPages}
                  onNext={handleTourNext}
                  onBack={handleTourBack}
                  onSkip={handleTourSkip}
                  onFinish={handleTourFinish}
                  t={t}
                  lang={lang}
                  displayedVotes={displayedVotes}
                  fairVotes={fairVotes}
                  enabledBias={enabledOpinionBias}
                  onPollChange={handlePollChange}
                  opinionFactors={opinionFactors}
                  voteFactors={voteFactors}
                  seatFactors={seatFactors}
                  winner={winner}
                  onOpinionFactorToggle={handleOpinionFactorToggle}
                  onOpinionFactorChange={handleOpinionFactorChange}
                  onVoteFactorToggle={handleVoteFactorToggle}
                  onVoteFactorChange={handleVoteFactorChange}
                  onSeatFactorToggle={handleSeatFactorToggle}
                  onSeatFactorChange={handleSeatFactorChange}
                />
              </div>
            </div>

            {/* Parliament - on bottom on mobile, left on desktop */}
            <div className="order-2 lg:order-1">
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Landmark className="w-5 h-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">{t.seatDistribution}</h2>
                </div>
                <ParliamentChart seats={finalSeats} />
                <PartyLegend seats={finalSeats} lang={lang} />
                <div className="mt-6">
                  <SeatBar seats={finalSeats} t={t} />
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Dashboard Mode Layout */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Parliament & Flow (sticky together) */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-4 space-y-6">
                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Landmark className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">{t.seatDistribution}</h2>
                  </div>
                  <ParliamentChart seats={finalSeats} />
                  <PartyLegend seats={finalSeats} lang={lang} />
                  <div className="mt-6">
                    <SeatBar seats={finalSeats} t={t} />
                  </div>
                </motion.div>

                <motion.div
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <FlowDiagram
                    fairVotes={fairVotes}
                    effectiveVotes={effectiveVotes}
                    displayedVotes={displayedVotes}
                    seats={finalSeats}
                    hasDisabledVoteBias={opinionFactors.some(f => !f.enabled) || voteFactors.some(f => !f.enabled)}
                    t={t}
                  />
                </motion.div>
              </div>
            </div>

            {/* Right Column - Controls */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <h2 className="text-lg font-semibold mb-4">{t.tour.pollsTitle}</h2>
              <p className="text-sm text-muted-foreground mb-6">{t.tour.pollsText}</p>
              <PollSliders
                displayedVotes={displayedVotes}
                fairVotes={fairVotes}
                enabledBias={enabledOpinionBias}
                onChange={handlePollChange}
                t={t}
                lang={lang}
              />
              {voteFactors.some(f => f.enabled) && (
                <div className="mt-4 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                  <strong className="text-foreground">{t.legendTitle}</strong> {t.legendTextNew}
                </div>
              )}
            </motion.div>

            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              {/* Restart tour CTA */}
              <button
                onClick={handleRestartTour}
                className="w-full mb-6 p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                {t.tour.restartTour}
              </button>

              {/* Opinion-forming biases */}
              <h3 className="text-base font-semibold mb-1">{t.opinionFormingFactorsTitle}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {t.opinionFormingFactorsDesc}
              </p>
              <BiasControls
                factors={opinionFactors}
                winner={winner}
                lang={lang}
                onToggle={handleOpinionFactorToggle}
                onChange={handleOpinionFactorChange}
              />

              {/* Divider */}
              <div className="my-6 border-t border-border" />

              {/* Vote-gathering biases (foreign votes) */}
              <h3 className="text-base font-semibold mb-1">{t.voteGatheringFactorsTitle}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {t.voteGatheringFactorsDesc}
              </p>
              <BiasControls
                factors={voteFactors}
                winner={winner}
                lang={lang}
                onToggle={handleVoteFactorToggle}
                onChange={handleVoteFactorChange}
              />

              {/* Divider */}
              <div className="my-6 border-t border-border" />

              {/* Seat-conversion biases */}
              <h3 className="text-base font-semibold mb-1">{t.seatConversionFactorsTitle}</h3>
              <p className="text-xs text-muted-foreground mb-4">
                {t.seatConversionFactorsDesc}
              </p>
              <BiasControls
                factors={seatFactors}
                winner={winner}
                lang={lang}
                onToggle={handleSeatFactorToggle}
                onChange={handleSeatFactorChange}
              />
            </motion.div>

            {/* References */}
            <Collapsible open={showReferences} onOpenChange={setShowReferences}>
              <motion.div
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <ExternalLink className="h-4 w-4" />
                      {t.references}
                    </span>
                    {showReferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2">
                    {allReferences.map((ref, i) => (
                      <a
                        key={i}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <p className="text-sm font-medium">{ref.title}</p>
                        <p className="text-xs text-muted-foreground">{ref.source}</p>
                      </a>
                    ))}
                  </div>
                </CollapsibleContent>
              </motion.div>
            </Collapsible>
          </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>{t.legal.operator}:</span>
              <span className="font-medium">{t.legal.operatorName}</span>
              <span>·</span>
              <a href={`mailto:${t.legal.operatorEmail}`} className="hover:text-foreground transition-colors">
                {t.legal.operatorEmail}
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/gazdagergo/hungary-election-bias-simulator"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                {t.legal.sourceCode}
              </a>
              <Dialog>
                <DialogTrigger className="hover:text-foreground transition-colors">
                  {t.legal.privacyPolicy}
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{t.legal.privacyTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {t.legal.privacyContent}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger className="hover:text-foreground transition-colors">
                  {t.legal.cookiePolicy}
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{t.legal.cookieTitle}</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">
                    {t.legal.cookieContent}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
