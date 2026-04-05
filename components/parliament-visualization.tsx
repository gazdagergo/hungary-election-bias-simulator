"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
  RotateCcw
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Translations
type Language = "hu" | "en"

const translations = {
  hu: {
    title: "A magyar választási rendszer",
    titleAccent: "torzításai",
    subtitle: "Hogyan alakulnak át a szavazatok mandátumokká? Állítsd be a paramétereket és figyeld meg a hatást.",
    seatDistribution: "Mandátumeloszlás",
    majority: "többség",
    twoThirds: "2/3",
    transformationFlow: "Az átalakulás menete",
    fairPreference: "Valós preferencia",
    measuredVotes: "Mért szavazat",
    finalSeats: "Végső mandátum",
    voteGatheringBiases: "Szavazatszerzési torzítások",
    seatConversionBiases: "Mandátumszámítási",
    voteGatheringDesc: "propaganda, szavazatvásárlás",
    seatConversionDesc: "gerrymandering, győzteskompenzáció",
    voterPreference: "Valós szavazói preferencia",
    voterPreferenceTooltip: "Ez az elméleti szavazati arány, ha nem lenne állami propaganda és egyéb szavazatszerzési torzítás. A közvéleménykutatások már tartalmazzák ezeket a hatásokat!",
    voteGatheringFactorsTitle: "Szavazatszerzési torzítások",
    voteGatheringFactorsDesc: "Ezek a tényezők a szavazatok számát befolyásolják – a közvéleménykutatások már tartalmazzák őket.",
    seatConversionFactorsTitle: "Mandátumszámítási torzítások",
    seatConversionFactorsDesc: "Ezek a tényezők azt befolyásolják, hogyan alakulnak a szavazatok mandátumokká.",
    references: "Források és hivatkozások",
    sources: "Források:",
    legendTitle: "Jelmagyarázat:",
    legendTextNew: "A szám mellett látható érték mutatja, mekkora lenne a párt támogatottsága torzítások nélkül.",
    fair: "valós",
    measuredVotesTitle: "Mért szavazatok (közvéleménykutatás)",
    measuredVotesTooltip: "Ez a közvéleménykutatások által mért szavazati arány. Ez már tartalmazza a propaganda és egyéb szavazatszerzési torzítások hatását!",
    helpsWinner: "Győztest segíti",
    seats: "mandátum",
    headerLabel: "Választási elemzés",
    // Tour translations
    tour: {
      next: "Következő",
      back: "Vissza",
      skip: "Ugrás a dashboardhoz",
      startExploring: "Felfedezés indítása",
      finish: "Befejezés",
      stepOf: "lépés",
      restartTour: "Túra újraindítása",
      introTitle: "Üdvözöljük!",
      introText: "Ez az interaktív eszköz bemutatja, hogyan alakulnak át a szavazatok parlamenti mandátumokká a magyar választási rendszerben, és milyen torzítások befolyásolják ezt a folyamatot.",
      introDisclaimer: "Fontos: Ez nem egy előrejelzés! A vizualizáció az Ön által beállított közvéleménykutatási adatokra és torzítási paraméterekre épül. Fedezze fel, hogyan változik a mandátumeloszlás különböző feltételek mellett.",
      pollsTitle: "Közvéleménykutatási adatok",
      pollsText: "Állítsa be a pártok jelenlegi támogatottságát a legfrissebb közvéleménykutatások alapján. Ezek az adatok már tartalmazzák a szavazatszerzési torzítások (propaganda, szavazatvásárlás stb.) hatását.",
      biasIntro: "A következő lépésekben megismerheti azokat a torzításokat, amelyek befolyásolják a választási eredményeket. Minden torzításnál beállíthatja annak mértékét és ki-/bekapcsolhatja.",
      adjustableNote: "Az alábbi csúszkával beállíthatja a torzítás becsült mértékét. Az alapértelmezett érték egy becslés – módosíthatja saját kutatása alapján.",
    },
    factors: {
      propaganda: {
        name: "Állami propaganda",
        description: "A közmédia és a kormánypárti média dominanciája. 2019-re a hírmédiapiac 77,8%-át kormánypárti média uralta. Az MTVA évi 130 milliárd forintból működik. Ez a szavazók véleményét befolyásolja, mielőtt a szavazófülkébe lépnének."
      },
      voteBuying: {
        name: "Szavazatvásárlás",
        description: "Közpénzből finanszírozott kampányok, közfoglalkoztatottak nyomás alá helyezése, szelektív forrás-elosztás. A szociálisan kiszolgáltatott szavazók befolyásolása."
      },
      mailVoting: {
        name: "Határon túli levélszavazás",
        description: "A határon túli magyarok 95-96%-a a Fideszre szavaz. 2022-ben kb. 268.000 határon túli szavazott. Ez extra szavazatokat jelent a Fidesznek, akik nem az országban élnek."
      },
      embassyVoting: {
        name: "Nyugati magyarok korlátozott szavazása",
        description: "A Magyarországon lakcímmel rendelkező, de külföldön élő magyarok csak nagykövetségeken szavazhatnak. A részvételi arányuk hatszor alacsonyabb - ők jellemzően ellenzékiek."
      },
      gerrymandering: {
        name: "Gerrymandering",
        description: "A 2011-es választási törvény újrarajzolta a választókerületek határait. A Fidesz-szavazók többsége kisebb lakosságú körzetekben van, míg az ellenzéki körzetek nagyobbak."
      },
      twoRound: {
        name: "Kétfordulós szavazás eltörlése",
        description: "2011-ben egykörös rendszerre váltottak. Ez megakadályozza, hogy az ellenzéki szavazók a második fordulóban taktikailag összefogva szavazzanak."
      },
      minorityMp: {
        name: "Német nemzetiségi képviselő",
        description: "A német nemzetiségi lista képviselője, Ritter Imre, korábban fideszes önkormányzati képviselő volt, és minden parlamenti szavazáson a kormányt támogatja."
      },
      winnerCompensation: {
        name: "Győzteskompenzáció",
        description: "A győztes egyéni jelöltek többletszavazatai is átkerülnek a pártlistára. Ez a mindenkori győztest segíti - ha a Tisza nyer, nekik kedvez!"
      },
      parliamentSize: {
        name: "Parlament létszámának csökkentése",
        description: "386-ról 199-re csökkentették a létszámot. Ez növelte a többségi elemek súlyát, és a győztest segíti."
      },
      electoralWeighting: {
        name: "Választási rendszer súlyozása (1989 óta)",
        description: "A magyar vegyes rendszer eredendően a győztest segíti - ez nem Fidesz-találmány. A többségi elem (106 egyéni körzet) természeténél fogva torzít."
      }
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
    measuredVotes: "Measured votes",
    finalSeats: "Final seats",
    voteGatheringBiases: "Vote-gathering biases",
    seatConversionBiases: "Seat-conversion",
    voteGatheringDesc: "propaganda, vote buying",
    seatConversionDesc: "gerrymandering, winner compensation",
    voterPreference: "Fair voter preference",
    voterPreferenceTooltip: "This is the theoretical vote share without state propaganda and other vote-gathering biases. Polls already include these effects!",
    voteGatheringFactorsTitle: "Vote-gathering biases",
    voteGatheringFactorsDesc: "These factors affect the number of votes – polls already include them.",
    seatConversionFactorsTitle: "Seat-conversion biases",
    seatConversionFactorsDesc: "These factors affect how votes are converted to seats.",
    references: "Sources and references",
    sources: "Sources:",
    legendTitle: "Legend:",
    legendTextNew: "The value next to the number shows what the party's support would be without biases.",
    fair: "fair",
    measuredVotesTitle: "Measured votes (polls)",
    measuredVotesTooltip: "This is the vote share measured by polls. It already includes the effect of propaganda and other vote-gathering biases!",
    helpsWinner: "Helps winner",
    seats: "seats",
    headerLabel: "Electoral Analysis",
    // Tour translations
    tour: {
      next: "Next",
      back: "Back",
      skip: "Skip to dashboard",
      startExploring: "Start exploring",
      finish: "Finish",
      stepOf: "of",
      restartTour: "Restart tour",
      introTitle: "Welcome!",
      introText: "This interactive tool shows how votes are converted into parliamentary seats in the Hungarian electoral system, and what biases influence this process.",
      introDisclaimer: "Important: This is not a prediction! The visualization is based on poll data and bias parameters that you set. Explore how seat distribution changes under different conditions.",
      pollsTitle: "Poll data",
      pollsText: "Set the current support levels for parties based on the latest polls. These figures already include the effects of vote-gathering biases (propaganda, vote buying, etc.).",
      biasIntro: "In the following steps, you'll learn about the biases that affect electoral outcomes. For each bias, you can adjust its magnitude and toggle it on/off.",
      adjustableNote: "Use the slider below to adjust the estimated magnitude of this bias. The default value is an estimate – feel free to modify it based on your own research.",
    },
    factors: {
      propaganda: {
        name: "State propaganda",
        description: "Dominance of public and pro-government media. By 2019, 77.8% of the news media market was controlled by pro-government media. MTVA operates with 130 billion HUF annually. This influences voters' opinions before they enter the voting booth."
      },
      voteBuying: {
        name: "Vote buying",
        description: "Campaigns financed with public funds, pressure on public workers, selective resource allocation. Influencing socially vulnerable voters."
      },
      mailVoting: {
        name: "Cross-border mail voting",
        description: "95-96% of Hungarians abroad vote for Fidesz. In 2022, about 268,000 cross-border Hungarians voted. This means extra votes for Fidesz from people who don't live in the country."
      },
      embassyVoting: {
        name: "Restricted voting for Western Hungarians",
        description: "Hungarians with Hungarian addresses but living abroad can only vote at embassies. Their participation rate is six times lower - they tend to be opposition voters."
      },
      gerrymandering: {
        name: "Gerrymandering",
        description: "The 2011 electoral law redrew constituency boundaries. Fidesz voters are concentrated in smaller population districts, while opposition districts are larger."
      },
      twoRound: {
        name: "Abolition of two-round voting",
        description: "In 2011, they switched to a single-round system. This prevents opposition voters from tactically uniting in the second round."
      },
      minorityMp: {
        name: "German minority MP",
        description: "The German minority list representative, Imre Ritter, was previously a Fidesz municipal representative and supports the government in every parliamentary vote."
      },
      winnerCompensation: {
        name: "Winner compensation",
        description: "Surplus votes from winning individual candidates are transferred to the party list. This helps whoever wins - if Tisza wins, it benefits them!"
      },
      parliamentSize: {
        name: "Reduction of parliament size",
        description: "Reduced from 386 to 199 seats. This increased the weight of majoritarian elements and helps the winner."
      },
      electoralWeighting: {
        name: "Electoral system weighting (since 1989)",
        description: "The Hungarian mixed system inherently helps the winner - this is not a Fidesz invention. The majoritarian element (106 individual districts) naturally distorts."
      }
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

// Factor categories
type FactorCategory = "vote-gathering" | "seat-conversion"
type Beneficiary = "fidesz" | "winner"

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

// Default values from taktikaiszavazas.hu polls
const DEFAULT_MEASURED_VOTES: VoteShare = {
  tisza: 40,
  fidesz: 28,
  smallParty: 5,
}

// Vote-gathering biases
const voteGatheringFactors: Factor[] = [
  {
    id: "propaganda",
    nameKey: "propaganda",
    enabled: true,
    value: 5,
    maxValue: 12,
    minValue: 2,
    category: "vote-gathering",
    beneficiary: "fidesz",
    references: [
      { title: "Hungary 2022: Manipulated Elections", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "OSCE/ODIHR Final Report 2022", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE" }
    ]
  },
  {
    id: "vote-buying",
    nameKey: "voteBuying",
    enabled: true,
    value: 3,
    maxValue: 8,
    minValue: 1,
    category: "vote-gathering",
    beneficiary: "fidesz",
    references: [
      { title: "Blackmailing of financially vulnerable voters", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" }
    ]
  },
  {
    id: "mail-voting",
    nameKey: "mailVoting",
    enabled: true,
    value: 2,
    maxValue: 5,
    minValue: 1,
    category: "vote-gathering",
    beneficiary: "fidesz",
    references: [
      { title: "Ket mandatumot hoztak a Fidesz-KDNP-nek a levelszavazatok", url: "https://maszol.ro/kulfold/Ket-mandatumot-hoztak-a-Fidesz-KDNP-nek-a-levelszavazatok", source: "Maszol.ro" }
    ]
  },
  {
    id: "embassy-voting",
    nameKey: "embassyVoting",
    enabled: true,
    value: 1,
    maxValue: 3,
    minValue: 0,
    category: "vote-gathering",
    beneficiary: "fidesz",
    references: [
      { title: "Different registration and voting procedures", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE/ODIHR" }
    ]
  },
]

// Seat-conversion biases
const seatConversionFactors: Factor[] = [
  {
    id: "gerrymandering",
    nameKey: "gerrymandering",
    enabled: true,
    value: 6,
    maxValue: 12,
    minValue: 2,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      { title: "Tuljutalmazott gyoztes", url: "https://poltudszemle.hu/articles/tuljutalmazott-gyoztes/", source: "Politikatudomanyi Szemle (2024)" },
      { title: "Hungary 2022: Manipulated Elections", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" }
    ]
  },
  {
    id: "two-round",
    nameKey: "twoRound",
    enabled: true,
    value: 8,
    maxValue: 15,
    minValue: 3,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer - Public Choice (2025)" }
    ]
  },
  {
    id: "minority-mp",
    nameKey: "minorityMp",
    enabled: true,
    value: 1,
    maxValue: 1,
    minValue: 1,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      { title: "Hungary 2022: Manipulated Elections - Minority mandates", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" }
    ]
  },
  {
    id: "winner-compensation",
    nameKey: "winnerCompensation",
    enabled: true,
    value: 5,
    maxValue: 10,
    minValue: 2,
    category: "seat-conversion",
    beneficiary: "winner",
    references: [
      { title: "Tuljutalmazott gyoztes", url: "https://poltudszemle.hu/articles/tuljutalmazott-gyoztes/", source: "Politikatudomanyi Szemle" },
      { title: "Mi az a gyozteskompenzacio?", url: "https://www.szavaz.at/rendszerek/vegyes/gyozteskompenzacio", source: "szavaz.at" }
    ]
  },
  {
    id: "parliament-size",
    nameKey: "parliamentSize",
    enabled: true,
    value: 3,
    maxValue: 6,
    minValue: 1,
    category: "seat-conversion",
    beneficiary: "winner",
    references: [
      { title: "The 'hacking' of a mixed electoral system", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer" }
    ]
  },
  {
    id: "electoral-weighting",
    nameKey: "electoralWeighting",
    enabled: false,
    value: 8,
    maxValue: 15,
    minValue: 4,
    category: "seat-conversion",
    beneficiary: "winner",
    references: [
      { title: "The 'hacking' of a mixed electoral system - Historical context", url: "https://link.springer.com/article/10.1007/s11127-025-01296-z", source: "Springer" }
    ]
  },
]

// Parliament visualization component with hemicycle layout
function ParliamentChart({ seats }: { seats: PartySeats }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate seat positions with even spacing across all rows
  // Using constant arc-length per seat for even distribution
  const seatPositions = useMemo(() => {
    const centerX = 280
    const centerY = 270
    const innerRadius = 80
    const outerRadius = 240
    const numRows = 7
    const dotRadius = 7
    const dotSpacing = dotRadius * 2.2 // Space between dot centers

    // Calculate total seats we can fit with even spacing
    const positions: { x: number; y: number; angle: number }[] = []

    for (let row = 0; row < numRows; row++) {
      const radius = innerRadius + (outerRadius - innerRadius) * (row / (numRows - 1))
      // Calculate how many dots fit in this semicircle with even spacing
      const arcLength = Math.PI * radius
      const seatsInRow = Math.floor(arcLength / dotSpacing)

      for (let i = 0; i < seatsInRow; i++) {
        // Distribute evenly across the semicircle (π to 0)
        const angle = Math.PI - (Math.PI * (i + 0.5)) / seatsInRow
        const x = centerX + radius * Math.cos(angle)
        const y = centerY - radius * Math.sin(angle)
        positions.push({ x, y, angle })
      }
    }

    // Take only the 199 seats we need, sorted by angle for radial coloring
    // Sort by angle (left to right = π to 0), which means descending order
    positions.sort((a, b) => b.angle - a.angle)

    return positions.slice(0, TOTAL_SEATS)
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
  measuredVotes,
  seats,
  hasDisabledVoteBias,
  t
}: {
  fairVotes: VoteShare
  effectiveVotes: VoteShare
  measuredVotes: VoteShare
  seats: PartySeats
  hasDisabledVoteBias: boolean
  t: typeof translations.hu
}) {
  // Show strikethrough on middle step when vote biases are disabled and values differ
  const valuesChanged = hasDisabledVoteBias && (
    measuredVotes.fidesz !== Math.round(effectiveVotes.fidesz) ||
    measuredVotes.tisza !== Math.round(effectiveVotes.tisza) ||
    measuredVotes.smallParty !== Math.round(effectiveVotes.smallParty)
  )

  const steps = [
    {
      icon: Monitor,
      label: t.fairPreference,
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
      label: hasDisabledVoteBias ? t.measuredVotes + " *" : t.measuredVotes,
      tisza: `${Math.round(effectiveVotes.tisza)}%`,
      fidesz: `${Math.round(effectiveVotes.fidesz)}%`,
      smallParty: `${Math.round(effectiveVotes.smallParty)}%`,
      highlight: hasDisabledVoteBias,
      showStrikethrough: valuesChanged,
      originalTisza: measuredVotes.tisza,
      originalFidesz: measuredVotes.fidesz,
      originalSmallParty: measuredVotes.smallParty,
    },
    {
      icon: Landmark,
      label: t.finalSeats,
      tisza: `${seats.tisza}`,
      fidesz: `${seats.fidesz}`,
      smallParty: `${seats.smallParty}`,
      highlight: false,
      showStrikethrough: false,
      originalTisza: 0,
      originalFidesz: 0,
      originalSmallParty: 0,
    },
  ]

  const arrows = [
    `${t.voteGatheringBiases} (${t.voteGatheringDesc})`,
    `${t.seatConversionBiases} (${t.seatConversionDesc})`,
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
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-tisza" />
                <span className="text-lg font-bold">{step.tisza}</span>
                {step.showStrikethrough && step.originalTisza !== Math.round(effectiveVotes.tisza) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalTisza}%</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-fidesz" />
                <span className="text-lg font-bold">{step.fidesz}</span>
                {step.showStrikethrough && step.originalFidesz !== Math.round(effectiveVotes.fidesz) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalFidesz}%</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-smallParty" />
                <span className="text-lg font-bold">{step.smallParty}</span>
                {step.showStrikethrough && step.originalSmallParty !== Math.round(effectiveVotes.smallParty) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalSmallParty}%</span>
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
  measuredVotes,
  fairVotes,
  onChange,
  t,
  lang
}: {
  measuredVotes: VoteShare
  fairVotes: VoteShare
  onChange: (party: keyof VoteShare, value: number) => void
  t: typeof translations.hu
  lang: Language
}) {
  const smallPartyName = lang === "hu" ? "Kis párt (5%+)" : "Small party (5%+)"
  const parties = [
    { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
    { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
    { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 5, max: 20 },
  ]

  return (
    <div className="space-y-6">
      {parties.map((party) => (
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
              <span className="text-lg font-bold">{measuredVotes[party.key]}%</span>
              {Math.round(fairVotes[party.key]) !== measuredVotes[party.key] && (
                <span className="text-xs text-accent ml-1.5 font-medium">
                  ({t.fair}: {Math.round(fairVotes[party.key])}%)
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min={party.min}
              max={party.max}
              value={measuredVotes[party.key]}
              onChange={(e) => onChange(party.key, parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${party.color} ${((measuredVotes[party.key] - party.min) / (party.max - party.min)) * 100}%, hsl(220, 15%, 18%) ${((measuredVotes[party.key] - party.min) / (party.max - party.min)) * 100}%)`,
              }}
            />
          </div>
        </motion.div>
      ))}
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
        const actualBeneficiary = isWinnerFactor ? winner : "fidesz"
        const beneficiaryColor = actualBeneficiary === "tisza" ? PARTY_COLORS.tisza : PARTY_COLORS.fidesz
        const beneficiaryName = actualBeneficiary === "tisza" ? "Tisza" : "Fidesz"
        const unit = factor.category === "vote-gathering" ? "%" : ` ${t.seats}`

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
              <span className="text-xs font-semibold" style={{ color: beneficiaryColor }}>
                +{factor.value}{unit} {beneficiaryName}
              </span>
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
  measuredVotes,
  fairVotes,
  onPollChange,
  voteFactors,
  seatFactors,
  winner,
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
  measuredVotes: VoteShare
  fairVotes: VoteShare
  onPollChange: (party: keyof VoteShare, value: number) => void
  voteFactors: Factor[]
  seatFactors: Factor[]
  winner: "tisza" | "fidesz"
  onVoteFactorToggle: (id: string) => void
  onVoteFactorChange: (id: string, value: number) => void
  onSeatFactorToggle: (id: string) => void
  onSeatFactorChange: (id: string, value: number) => void
}) {
  const isLastPage = currentPage === totalPages - 1
  const isFirstPage = currentPage === 0

  // Calculate which bias we're showing (if any)
  // Page 0: Intro, Page 1: Polls, Pages 2+: Biases
  const allFactors = [...voteFactors, ...seatFactors]
  const biasIndex = currentPage - 2
  const currentFactor = biasIndex >= 0 ? allFactors[biasIndex] : null
  const isVoteFactor = currentFactor ? voteFactors.some(f => f.id === currentFactor.id) : false

  const renderContent = () => {
    // Page 0: Introduction
    if (currentPage === 0) {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{t.tour.introTitle}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t.tour.introText}
          </p>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-accent-foreground">
              <strong>⚠️ {t.tour.introDisclaimer.split(':')[0]}:</strong>
              {t.tour.introDisclaimer.split(':').slice(1).join(':')}
            </p>
          </div>
        </div>
      )
    }

    // Page 1: Polls
    if (currentPage === 1) {
      const smallPartyName = lang === "hu" ? "Kis párt (5%+)" : "Small party (5%+)"
      const parties = [
        { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
        { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
        { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 5, max: 20 },
      ]

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">{t.tour.pollsTitle}</h2>
            <p className="text-sm text-muted-foreground">{t.tour.pollsText}</p>
          </div>

          <div className="space-y-5">
            {parties.map((party) => (
              <div key={party.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="text-sm font-medium">{party.name}</span>
                  </div>
                  <span className="text-lg font-bold">{measuredVotes[party.key]}%</span>
                </div>
                <input
                  type="range"
                  min={party.min}
                  max={party.max}
                  value={measuredVotes[party.key]}
                  onChange={(e) => onPollChange(party.key, parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${party.color} ${((measuredVotes[party.key] - party.min) / (party.max - party.min)) * 100}%, hsl(220, 15%, 18%) ${((measuredVotes[party.key] - party.min) / (party.max - party.min)) * 100}%)`,
                  }}
                />
              </div>
            ))}
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
                <p className="text-xs text-muted-foreground">Közvéleménykutatások összesítése</p>
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
      const actualBeneficiary = isWinnerFactor ? winner : "fidesz"
      const beneficiaryColor = actualBeneficiary === "tisza" ? PARTY_COLORS.tisza : PARTY_COLORS.fidesz
      const beneficiaryName = actualBeneficiary === "tisza" ? "Tisza" : "Fidesz"
      const unit = currentFactor.category === "vote-gathering" ? "%" : ` ${t.seats}`

      const handleToggle = isVoteFactor ? onVoteFactorToggle : onSeatFactorToggle
      const handleChange = isVoteFactor ? onVoteFactorChange : onSeatFactorChange

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
              {currentFactor.category === "vote-gathering" ? t.voteGatheringBiases : t.seatConversionBiases}
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
                  <span className="text-muted-foreground">{lang === "hu" ? "Hatás mértéke" : "Effect magnitude"}</span>
                  <span className="font-semibold" style={{ color: currentFactor.enabled ? beneficiaryColor : undefined }}>
                    +{currentFactor.value}{unit} {beneficiaryName}
                  </span>
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
                <span className="font-semibold" style={{ color: currentFactor.enabled ? beneficiaryColor : undefined }}>
                  +{currentFactor.value}{unit} {beneficiaryName}
                </span>
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

      {/* Navigation */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
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
  const [lang, setLang] = useState<Language>("hu")
  const [measuredVotes, setMeasuredVotes] = useState<VoteShare>(DEFAULT_MEASURED_VOTES)
  const [voteFactors, setVoteFactors] = useState<Factor[]>(voteGatheringFactors)
  const [seatFactors, setSeatFactors] = useState<Factor[]>(seatConversionFactors)
  const [showReferences, setShowReferences] = useState(false)

  // Tour state
  const [isTourMode, setIsTourMode] = useState(true)
  const [tourPage, setTourPage] = useState(0)

  // Total tour pages: intro + polls + all biases
  const totalTourPages = 2 + voteFactors.length + seatFactors.length

  const t = translations[lang]

  // Calculate FAIR votes (theoretical: what votes would be with ALL biases removed)
  // This is for display in the flow diagram
  const fairVotes = useMemo((): VoteShare => {
    // Sum ALL vote-gathering biases (regardless of enabled state)
    let totalBias = 0
    voteFactors.forEach(f => {
      totalBias += f.value
    })

    if (totalBias === 0) return measuredVotes

    const fairFidesz = Math.max(0, measuredVotes.fidesz - totalBias)
    const redistributed = measuredVotes.fidesz - fairFidesz
    const otherTotal = measuredVotes.tisza + measuredVotes.smallParty

    return {
      tisza: otherTotal > 0 ? measuredVotes.tisza + (redistributed * measuredVotes.tisza / otherTotal) : measuredVotes.tisza,
      fidesz: fairFidesz,
      smallParty: otherTotal > 0 ? measuredVotes.smallParty + (redistributed * measuredVotes.smallParty / otherTotal) : measuredVotes.smallParty,
    }
  }, [measuredVotes, voteFactors])

  // Calculate EFFECTIVE votes for seat calculation
  // When biases are ON: we acknowledge they exist, use measured votes (polls as-is)
  // When biases are OFF: we remove that bias effect, showing theoretical fair scenario
  const effectiveVotes = useMemo((): VoteShare => {
    // Calculate how much bias is currently DISABLED (removed from the equation)
    let removedBias = 0
    voteFactors.filter(f => !f.enabled).forEach(f => {
      removedBias += f.value
    })

    if (removedBias === 0) return measuredVotes // All biases acknowledged, use polls as-is

    // Subtract the disabled biases from Fidesz and redistribute to others
    const adjustedFidesz = Math.max(0, measuredVotes.fidesz - removedBias)
    const redistributed = measuredVotes.fidesz - adjustedFidesz
    const otherTotal = measuredVotes.tisza + measuredVotes.smallParty

    return {
      tisza: otherTotal > 0 ? measuredVotes.tisza + (redistributed * measuredVotes.tisza / otherTotal) : measuredVotes.tisza,
      fidesz: adjustedFidesz,
      smallParty: otherTotal > 0 ? measuredVotes.smallParty + (redistributed * measuredVotes.smallParty / otherTotal) : measuredVotes.smallParty,
    }
  }, [measuredVotes, voteFactors])

  const winner: "tisza" | "fidesz" = effectiveVotes.tisza >= effectiveVotes.fidesz ? "tisza" : "fidesz"

  const proportionalSeats = useMemo((): PartySeats => {
    const total = effectiveVotes.tisza + effectiveVotes.fidesz + effectiveVotes.smallParty
    if (total === 0) return { tisza: 0, fidesz: 0, smallParty: 0 }

    return {
      tisza: Math.round(TOTAL_SEATS * effectiveVotes.tisza / total),
      fidesz: Math.round(TOTAL_SEATS * effectiveVotes.fidesz / total),
      smallParty: Math.round(TOTAL_SEATS * effectiveVotes.smallParty / total),
    }
  }, [effectiveVotes])

  const finalSeats = useMemo((): PartySeats => {
    let fideszBias = 0
    let winnerBias = 0

    seatFactors.filter(f => f.enabled).forEach(f => {
      if (f.beneficiary === "fidesz") fideszBias += f.value
      else winnerBias += f.value
    })

    let tisza = proportionalSeats.tisza
    let fidesz = proportionalSeats.fidesz
    const smallParty = proportionalSeats.smallParty

    fidesz += fideszBias
    tisza -= fideszBias

    if (winner === "tisza") {
      tisza += winnerBias
      fidesz -= Math.round(winnerBias * 0.7)
    } else {
      fidesz += winnerBias
      tisza -= Math.round(winnerBias * 0.7)
    }

    return {
      tisza: Math.max(0, Math.min(TOTAL_SEATS, tisza)),
      fidesz: Math.max(0, Math.min(TOTAL_SEATS, fidesz)),
      smallParty: Math.max(0, smallParty),
    }
  }, [proportionalSeats, seatFactors, winner])

  const handlePollChange = useCallback((party: keyof VoteShare, value: number) => {
    setMeasuredVotes(prev => ({ ...prev, [party]: value }))
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
    ;[...voteFactors, ...seatFactors].forEach(f => {
      f.references.forEach(r => refs.set(r.url, r))
    })
    return Array.from(refs.values())
  }, [voteFactors, seatFactors])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Landmark className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">{t.headerLabel}</span>
          </div>
          <button
            onClick={() => setLang(lang === "hu" ? "en" : "hu")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === "hu" ? "English" : "Magyar"}
          </button>
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
                  measuredVotes={measuredVotes}
                  fairVotes={fairVotes}
                  onPollChange={handlePollChange}
                  voteFactors={voteFactors}
                  seatFactors={seatFactors}
                  winner={winner}
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
                    measuredVotes={measuredVotes}
                    seats={finalSeats}
                    hasDisabledVoteBias={voteFactors.some(f => !f.enabled)}
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
                <h2 className="text-lg font-semibold mb-6">
                {t.measuredVotesTitle}
              </h2>
              <PollSliders
                measuredVotes={measuredVotes}
                fairVotes={fairVotes}
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

              {/* Vote-gathering biases */}
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
    </div>
  )
}
