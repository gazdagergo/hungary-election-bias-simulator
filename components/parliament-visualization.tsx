"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
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
  Globe,
  Monitor
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
  mihazank: "hsl(145, 55%, 42%)",
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
  mihazank: number
}

interface VoteShare {
  tisza: number
  fidesz: number
  mihazank: number
}

// Default values from taktikaiszavazas.hu polls
const DEFAULT_MEASURED_VOTES: VoteShare = {
  tisza: 40,
  fidesz: 28,
  mihazank: 5,
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

  const seatData = useMemo(() => {
    const result: { party: string; color: string }[] = []
    for (let i = 0; i < seats.tisza; i++) result.push({ party: "tisza", color: PARTY_COLORS.tisza })
    for (let i = 0; i < seats.fidesz; i++) result.push({ party: "fidesz", color: PARTY_COLORS.fidesz })
    for (let i = 0; i < seats.mihazank; i++) result.push({ party: "mihazank", color: PARTY_COLORS.mihazank })
    for (let i = result.length; i < TOTAL_SEATS; i++) result.push({ party: "other", color: PARTY_COLORS.other })
    return result
  }, [seats.tisza, seats.fidesz, seats.mihazank])

  const rows = [
    { count: 25, radius: 100 },
    { count: 30, radius: 130 },
    { count: 35, radius: 160 },
    { count: 38, radius: 190 },
    { count: 40, radius: 220 },
    { count: 31, radius: 250 },
  ]

  const seatPositions = useMemo(() => {
    const positions: { x: number; y: number; idx: number }[] = []
    let seatIdx = 0
    for (const row of rows) {
      for (let i = 0; i < row.count && seatIdx < TOTAL_SEATS; i++) {
        const angle = Math.PI - (Math.PI * (i + 0.5)) / row.count
        const x = 250 + row.radius * Math.cos(angle)
        const y = 260 - row.radius * Math.sin(angle)
        positions.push({ x, y, idx: seatIdx })
        seatIdx++
      }
    }
    return positions
  }, [])

  if (!mounted) {
    return <div className="w-full h-[280px]" />
  }

  return (
    <div className="w-full flex justify-center">
      <svg viewBox="0 0 500 280" className="w-full max-w-lg" suppressHydrationWarning>
        {seatPositions.map((pos, i) => (
          <motion.circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r={7}
            fill={seatData[pos.idx]?.color || PARTY_COLORS.other}
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
function PartyLegend({ seats }: { seats: PartySeats }) {
  const parties = [
    { name: "Tisza", seats: seats.tisza, color: "bg-tisza" },
    { name: "Fidesz", seats: seats.fidesz, color: "bg-fidesz" },
    { name: "Mi Hazánk", seats: seats.mihazank, color: "bg-mihazank" },
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
    measuredVotes.mihazank !== Math.round(effectiveVotes.mihazank)
  )

  const steps = [
    {
      icon: Monitor,
      label: t.fairPreference,
      tisza: `${Math.round(fairVotes.tisza)}%`,
      fidesz: `${Math.round(fairVotes.fidesz)}%`,
      mihazank: `${Math.round(fairVotes.mihazank)}%`,
      highlight: false,
      showStrikethrough: false,
      originalTisza: 0,
      originalFidesz: 0,
      originalMihazank: 0,
    },
    {
      icon: Vote,
      label: hasDisabledVoteBias ? t.measuredVotes + " *" : t.measuredVotes,
      tisza: `${Math.round(effectiveVotes.tisza)}%`,
      fidesz: `${Math.round(effectiveVotes.fidesz)}%`,
      mihazank: `${Math.round(effectiveVotes.mihazank)}%`,
      highlight: hasDisabledVoteBias,
      showStrikethrough: valuesChanged,
      originalTisza: measuredVotes.tisza,
      originalFidesz: measuredVotes.fidesz,
      originalMihazank: measuredVotes.mihazank,
    },
    {
      icon: Landmark,
      label: t.finalSeats,
      tisza: `${seats.tisza}`,
      fidesz: `${seats.fidesz}`,
      mihazank: `${seats.mihazank}`,
      highlight: false,
      showStrikethrough: false,
      originalTisza: 0,
      originalFidesz: 0,
      originalMihazank: 0,
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
                <div className="w-2.5 h-2.5 rounded-full bg-mihazank" />
                <span className="text-lg font-bold">{step.mihazank}</span>
                {step.showStrikethrough && step.originalMihazank !== Math.round(effectiveVotes.mihazank) && (
                  <span className="text-xs text-muted-foreground line-through">{step.originalMihazank}%</span>
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
  t
}: {
  measuredVotes: VoteShare
  fairVotes: VoteShare
  onChange: (party: keyof VoteShare, value: number) => void
  t: typeof translations.hu
}) {
  const parties = [
    { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, max: 60 },
    { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, max: 60 },
    { key: "mihazank" as const, name: "Mi Hazánk", color: PARTY_COLORS.mihazank, max: 20 },
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
              min={0}
              max={party.max}
              value={measuredVotes[party.key]}
              onChange={(e) => onChange(party.key, parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${party.color} ${(measuredVotes[party.key] / party.max) * 100}%, hsl(220, 15%, 18%) ${(measuredVotes[party.key] / party.max) * 100}%)`,
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

// Main component
export function ParliamentVisualization() {
  const [lang, setLang] = useState<Language>("hu")
  const [measuredVotes, setMeasuredVotes] = useState<VoteShare>(DEFAULT_MEASURED_VOTES)
  const [voteFactors, setVoteFactors] = useState<Factor[]>(voteGatheringFactors)
  const [seatFactors, setSeatFactors] = useState<Factor[]>(seatConversionFactors)
  const [activeTab, setActiveTab] = useState<"vote" | "seat">("vote")
  const [showReferences, setShowReferences] = useState(false)

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
    const otherTotal = measuredVotes.tisza + measuredVotes.mihazank

    return {
      tisza: otherTotal > 0 ? measuredVotes.tisza + (redistributed * measuredVotes.tisza / otherTotal) : measuredVotes.tisza,
      fidesz: fairFidesz,
      mihazank: otherTotal > 0 ? measuredVotes.mihazank + (redistributed * measuredVotes.mihazank / otherTotal) : measuredVotes.mihazank,
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
    const otherTotal = measuredVotes.tisza + measuredVotes.mihazank

    return {
      tisza: otherTotal > 0 ? measuredVotes.tisza + (redistributed * measuredVotes.tisza / otherTotal) : measuredVotes.tisza,
      fidesz: adjustedFidesz,
      mihazank: otherTotal > 0 ? measuredVotes.mihazank + (redistributed * measuredVotes.mihazank / otherTotal) : measuredVotes.mihazank,
    }
  }, [measuredVotes, voteFactors])

  const winner: "tisza" | "fidesz" = effectiveVotes.tisza >= effectiveVotes.fidesz ? "tisza" : "fidesz"

  const proportionalSeats = useMemo((): PartySeats => {
    const total = effectiveVotes.tisza + effectiveVotes.fidesz + effectiveVotes.mihazank
    if (total === 0) return { tisza: 0, fidesz: 0, mihazank: 0 }

    return {
      tisza: Math.round(TOTAL_SEATS * effectiveVotes.tisza / total),
      fidesz: Math.round(TOTAL_SEATS * effectiveVotes.fidesz / total),
      mihazank: Math.round(TOTAL_SEATS * effectiveVotes.mihazank / total),
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
    const mihazank = proportionalSeats.mihazank

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
      mihazank: Math.max(0, mihazank),
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

      {/* Main Grid */}
      <div className="container max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Parliament & Flow */}
          <div className="lg:col-span-3 space-y-6">
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
              <PartyLegend seats={finalSeats} />
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
              {/* Tabs */}
              <div className="flex mb-6 p-1 rounded-lg bg-secondary">
                <button
                  onClick={() => setActiveTab("vote")}
                  className={`flex-1 text-sm py-2 px-3 rounded-md font-medium transition-all ${
                    activeTab === "vote"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.voteGatheringBiases}
                </button>
                <button
                  onClick={() => setActiveTab("seat")}
                  className={`flex-1 text-sm py-2 px-3 rounded-md font-medium transition-all ${
                    activeTab === "seat"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.seatConversionBiases}
                </button>
              </div>

              {activeTab === "vote" && (
                <>
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
                </>
              )}

              {activeTab === "seat" && (
                <>
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
                </>
              )}
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
      </div>
    </div>
  )
}
