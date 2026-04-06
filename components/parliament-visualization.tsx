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
    subtitle: "Hogyan lesznek a népszerűségi adatokból mandátumok?",
    seatDistribution: "Mandátumeloszlás",
    majority: "többség",
    twoThirds: "2/3",
    transformationFlow: "Az átalakulás menete",
    fairPreference: "Valós preferencia",
    measuredPreference: "Mért preferencia",
    measuredPreferenceTooltip: "A közvéleménykutatási adatokat a leadott szavazatokkal azonosnak tekintjük. A preferencia és a tényleges szavazás közötti eltérést (részvételi különbségek, rejtett szavazók, utolsó pillanatban változtatók) nem modellezzük megbízható adatok hiányában.",
    finalSeats: "Végső mandátum",
    opinionFormingBiases: "Véleményformáló torzítások",
    voteGatheringBiases: "Külföldi szavazatok",
    seatConversionBiases: "Mandátumszámítási",
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
      introTitle: "Kinek lejt a pálya?",
      introText: "Hajlamosak vagyunk a közvélemény-kutatás számait azonossá tenni a parlamentben megszerzett mandátumok arányaival. Ez az interaktív eszköz segít megérteni, hogy miért nincs ez így, hol lejt a pálya és hol súlyoz furcsán a magyar választási rendszer.",
      introDisclaimer: "Fontos: Az értékek mindenhol módosíthatók, nem kívánunk pontos előrejelzést adni, csupán felhívni a figyelmet a torzító hatások jelenlétére.",
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
      mailVoting: {
        name: "Határon túli levélszavazás",
        description: "A határon túli magyarok levélben szavazhatnak. 2022-ben ~264.000 érvényes szavazat érkezett, 93-96%-a Fideszre (2 mandátum). A szavazatok 70%-a Erdélyből. Érvénytelen szavazatok: 15%. A múltbeli minták változhatnak – a csúszka mindkét irányba állítható: pozitív érték Fidesz-, negatív érték Tisza-előnyt jelent."
      },
      embassyVoting: {
        name: "Nyugati magyarok korlátozott szavazása",
        description: "A magyar lakcímmel rendelkező, de külföldön élő magyarok (~400-500 ezer fő) csak nagykövetségen szavazhatnak személyesen. 2022-ben 65.000-en regisztráltak, ~57.000-en szavaztak. Fidesz támogatottság: 11% (nyugati emigránsok) vs 93% (határon túliak). Sokan 500-600 km-t utaznak."
      },
      gerrymandering: {
        name: "Gerrymandering",
        description: "A 2011-es törvény átláthatatlanul rajzolta át a körzeteket. Szimulációk szerint egyenlő szavazatarány esetén a Fidesz ~10 mandátummal előrébb végezne. Az ellenzéknek 3-5%-kal több szavazatra van szüksége a többséghez. A 2002-es és 2006-os választás is Fidesz-győzelem lett volna az új térképpel."
      },
      twoRound: {
        name: "Kétfordulós szavazás eltörlése",
        description: "2011-ben egykörös FPTP-rendszerre váltottak. 2014-ben a Fidesz 44%-os listás eredménnyel 91/106 egyéni körzetet nyert (86%). A töredezett ellenzék 35-40%-os Fidesz-győzelmeket eredményezett sok körzetben. Ez megakadályozza az ellenzék taktikai összefogását."
      },
      minorityMp: {
        name: "Német nemzetiségi képviselő",
        description: "Ritter Imre, volt fideszes önkormányzati képviselő, a német nemzetiségi lista mandátumát tölti be 2018 óta. Minden parlamenti szavazáson a kormányt támogatja, többször biztosítva a kétharmadot. 2026-ra a német nemzetiség valószínűleg elveszíti a mandátumot a regisztrált szavazók csökkenése miatt."
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
        description: "A magyar vegyes rendszer ALAP győztes-torzítása – ez nem Fidesz-találmány, 1989 óta létezik. A többségi elem természeténél fogva a győztest segíti. A 2011-es méretcsökkentés hatása ezen FELÜL jelentkezik."
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
    measuredPreference: "Measured preference",
    measuredPreferenceTooltip: "We treat poll data as equivalent to votes cast. The gap between stated preference and actual voting behavior (turnout differences, shy voters, last-minute changes) is not modeled due to lack of reliable data.",
    finalSeats: "Final seats",
    opinionFormingBiases: "Opinion-forming biases",
    voteGatheringBiases: "Foreign votes",
    seatConversionBiases: "Seat-conversion",
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
      introTitle: "The Tilted Playing Field",
      introText: "This interactive tool shows how votes are converted into parliamentary seats in the Hungarian electoral system, and what biases influence this process.",
      introDisclaimer: "Important: This is not a prediction! The visualization reflects your configured preference values and bias settings (default values are provided for all parameters). Explore how seat distribution changes under different conditions.",
      pollsTitle: "Poll data",
      pollsText: "Set the current support levels for parties based on the latest polls. These figures already include the effects of vote-gathering biases (propaganda, vote buying, etc.).",
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
      mailVoting: {
        name: "Cross-border mail voting",
        description: "Cross-border Hungarians can vote by mail. In 2022: ~264K valid votes, 93-96% for Fidesz (2 seats). 70% from Transylvania. Invalid ballots: 15%. Past patterns may change – the slider works both ways: positive = Fidesz advantage, negative = Tisza advantage."
      },
      embassyVoting: {
        name: "Restricted voting for Western Hungarians",
        description: "Hungarians with addresses but living abroad (~400-500K people) must vote in person at embassies. In 2022: 65K registered, ~57K voted. Fidesz support: 11% (Western emigrants) vs 93% (cross-border). Many travel 500-600 km to vote."
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
        name: "German minority MP",
        description: "Imre Ritter, former Fidesz municipal rep, holds the German minority seat since 2018. Supports the government in every vote, often securing the 2/3 majority. In 2026, the German minority will likely lose the seat due to declining registered voters."
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
        description: "The Hungarian mixed system's BASELINE winner-bias – not a Fidesz invention, exists since 1989. The majoritarian element naturally favors the winner. The 2011 size reduction effect applies ON TOP of this."
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
const DEFAULT_MEASURED_VOTES: VoteShare = {
  tisza: 48,
  fidesz: 40,
  smallParty: 5,
}

// Opinion-forming biases (affect domestic voter sentiment, reflected in polls)
const opinionFormingFactors: Factor[] = [
  {
    id: "propaganda",
    nameKey: "propaganda",
    enabled: true,
    value: 5,
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
    value: 3,
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
    id: "mail-voting",
    nameKey: "mailVoting",
    enabled: true,
    value: 2,
    maxValue: 5,
    minValue: -5,
    category: "vote-gathering",
    beneficiary: "bidirectional",
    references: [
      // International reports
      { title: "A Tale Of Two Diasporas: Hungarian Voters Abroad", url: "https://www.rferl.org/a/hungary-election-diaspora-orban-marki-zay/31712662.html", source: "RFE/RL" },
      { title: "Orbán's Election Machine Beyond Hungary's Borders", url: "https://thehungaryreport.com/the-election-machine-beyond-hungarys-borders/", source: "The Hungary Report" },
      { title: "Diasporas Intertwined: Transborder Hungarians", url: "https://www.populismstudies.org/diasporas-intertwined-the-role-of-transborder-hungarians-in-hungarys-diaspora-engagement/", source: "ECPS" },
      { title: "Fresh evidence of Hungary vote-rigging", url: "https://www.opendemocracy.net/en/breaking-fresh-evidence-hungary-vote-rigging-raises-concerns-fraud-european-elections/", source: "openDemocracy" },
      { title: "Will wooing the diaspora tip the election?", url: "https://www.euronews.com/2022/04/01/will-wooing-the-hungarian-diaspora-tip-the-election-in-orban-s-favour", source: "Euronews" },
      // Hungarian sources
      { title: "2022 választási eredmények", url: "https://www.valasztas.hu/ogy2022", source: "Nemzeti Választási Iroda" },
      { title: "Két mandátumot hoztak a levélszavazatok", url: "https://maszol.ro/kulfold/Ket-mandatumot-hoztak-a-Fidesz-KDNP-nek-a-levelszavazatok", source: "Maszol.ro" },
      { title: "Hány levélszavazatot kaptak a pártok", url: "https://www.portfolio.hu/gazdasag/20220409/kiderult-hany-levelszavazatot-kaptak-a-partok-538609", source: "Portfolio.hu" },
      { title: "Külhoni állampolgárok nélkül is meglenne a kétharmad", url: "https://pcblog.atlatszo.hu/2022/04/11/kulhoni-magyar-allampolgarok-nelkul-is-meglenne-a-ketharmad-a-gyoztes-tuljutalmazasa-nelkul-nem/", source: "Átlátszó PC Blog" },
      { title: "Erdélyi határon túliak szavazata", url: "https://transtelex.ro/kozelet/2022/04/01/erdely-hataron-tuliak-szavazata-levelszavazat", source: "Transtelex" },
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
      // International reports
      { title: "OSCE/ODIHR Final Report 2022 - Out-of-country voting", url: "https://www.osce.org/odihr/elections/523565", source: "OSCE" },
      { title: "A Tale Of Two Diasporas - Western vs Eastern", url: "https://www.rferl.org/a/hungary-election-diaspora-orban-marki-zay/31712662.html", source: "RFE/RL" },
      { title: "How Viktor Orbán Wins", url: "https://www.journalofdemocracy.org/articles/how-viktor-orban-wins/", source: "Journal of Democracy" },
      { title: "Record overseas voting could boost Tisza Party", url: "https://dailynewshungary.com/record-transfer-voting-boost-tisza-party/", source: "Daily News Hungary" },
      // Hungarian sources
      { title: "Több százezer külföldön élőből 65 ezren jutnak el az urnákig", url: "https://telex.hu/valasztas-2022/2022/03/30/valasztas-kulfoldon-elok-65-ezer-valasztasi-torveny", source: "Telex" },
      { title: "Rekordszámú szavazó várható a külképviseleteken", url: "https://telex.hu/belfold/2026/03/06/kulkepviseleti-szavazas-kulfoldi-magyarok-rekordszamban-tisza-kormanyvaltas", source: "Telex" },
      { title: "Szavazás külföldről – TASZ útmutató", url: "https://tasz.hu/tudastar/szavazas-kulfoldrol/", source: "TASZ" },
      { title: "Külföldről szavazó magyarok száma", url: "https://hu.euronews.com/2022/03/28/valasztasrol-valasztasra-jelentosen-no-a-kulfoldrol-szavazo-magyarok-szama", source: "Euronews HU" },
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
    value: 8,
    maxValue: 15,
    minValue: 3,
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
    minValue: 1,
    category: "seat-conversion",
    beneficiary: "fidesz",
    references: [
      // International reports
      { title: "Hungary 2022: Manipulated Elections - Minority mandates", url: "https://democracyinstitute.ceu.edu/sites/default/files/article/attachment/2022-03/Hungary%202022%20Manipulated%20Elections.pdf", source: "CEU Democracy Institute" },
      { title: "How Viktor Orbán Wins", url: "https://www.journalofdemocracy.org/articles/how-viktor-orban-wins/", source: "Journal of Democracy" },
      // Hungarian sources
      { title: "German Minority Receives Mandate in Parliament", url: "https://hungarytoday.hu/2022-general-parliamentary-elections-hungary-hungarian-parliament-german-minority-imre-ritter/", source: "Hungary Today" },
      { title: "Imre Ritter - Wikipedia", url: "https://en.wikipedia.org/wiki/Imre_Ritter", source: "Wikipedia" },
      { title: "What Will Happen to the German Mandate?", url: "https://hungarytoday.hu/what-will-happen-to-the-german-mandate/", source: "Hungary Today" },
      { title: "Orbán already secured a mandate in Parliament", url: "https://dailynewshungary.com/orban-already-secured-a-mandate-in-parliament/", source: "Daily News Hungary" },
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
    value: 3,
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
    value: 8,
    maxValue: 15,
    minValue: 4,
    category: "seat-conversion",
    beneficiary: "winner",
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
      originalTisza: measuredVotes.tisza,
      originalFidesz: measuredVotes.fidesz,
      originalSmallParty: measuredVotes.smallParty,
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
  const smallPartyAboveThreshold = measuredVotes.smallParty >= 5
  const smallPartyName = lang === "hu"
    ? (smallPartyAboveThreshold ? "Kis párt (5%+)" : "Kis párt (küszöb alatt)")
    : (smallPartyAboveThreshold ? "Small party (5%+)" : "Small party (below threshold)")
  const parties = [
    { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
    { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
    { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 3, max: 20 },
  ]

  const total = measuredVotes.tisza + measuredVotes.fidesz + measuredVotes.smallParty
  const others = 100 - total

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
        const unit = factor.category === "vote-gathering" ? "%" : ` ${t.seats}`
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
              <span className="text-xs font-semibold" style={{ color: beneficiaryColor }}>
                +{displayValue}{unit} {beneficiaryName}
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
  measuredVotes: VoteShare
  fairVotes: VoteShare
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
  // Page 0: Intro, Page 1: Polls, Pages 2+: Biases (opinion + vote + seat)
  const allFactors = [...opinionFactors, ...voteFactors, ...seatFactors]
  const biasIndex = currentPage - 2
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
      const smallPartyAboveThreshold = measuredVotes.smallParty >= 5
      const smallPartyName = lang === "hu"
        ? (smallPartyAboveThreshold ? "Kis párt (5%+)" : "Kis párt (küszöb alatt)")
        : (smallPartyAboveThreshold ? "Small party (5%+)" : "Small party (below threshold)")
      const parties = [
        { key: "tisza" as const, name: "Tisza", color: PARTY_COLORS.tisza, min: 0, max: 60 },
        { key: "fidesz" as const, name: "Fidesz", color: PARTY_COLORS.fidesz, min: 0, max: 60 },
        { key: "smallParty" as const, name: smallPartyName, color: PARTY_COLORS.smallParty, min: 3, max: 20 },
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
      const unit = currentFactor.category === "seat-conversion" ? ` ${t.seats}` : "%"
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
                  <span className="font-semibold" style={{ color: currentFactor.enabled ? beneficiaryColor : undefined }}>
                    +{displayValue}{unit} {beneficiaryName}
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
                  +{displayValue}{unit} {beneficiaryName}
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
  const [opinionFactors, setOpinionFactors] = useState<Factor[]>(opinionFormingFactors)
  const [voteFactors, setVoteFactors] = useState<Factor[]>(voteGatheringFactors)
  const [seatFactors, setSeatFactors] = useState<Factor[]>(seatConversionFactors)
  const [showReferences, setShowReferences] = useState(false)

  // Tour state
  const [isTourMode, setIsTourMode] = useState(true)
  const [tourPage, setTourPage] = useState(0)

  // Total tour pages: intro + polls + all biases (opinion + vote + seat)
  const totalTourPages = 2 + opinionFactors.length + voteFactors.length + seatFactors.length

  const t = translations[lang]

  // Calculate FAIR votes (theoretical domestic preference without opinion manipulation)
  // Only removes opinion-forming biases, NOT foreign votes (which are separate from polls)
  const fairVotes = useMemo((): VoteShare => {
    // Sum ALL opinion-forming biases (propaganda, vote buying)
    let fideszBias = 0
    opinionFactors.forEach(f => {
      fideszBias += f.value
    })

    if (fideszBias === 0) return measuredVotes

    const otherTotal = measuredVotes.tisza + measuredVotes.smallParty
    const fairFidesz = Math.max(0, measuredVotes.fidesz - fideszBias)
    const redistributed = measuredVotes.fidesz - fairFidesz

    return {
      tisza: otherTotal > 0 ? measuredVotes.tisza + (redistributed * measuredVotes.tisza / otherTotal) : measuredVotes.tisza,
      fidesz: fairFidesz,
      smallParty: measuredVotes.smallParty,
    }
  }, [measuredVotes, opinionFactors])

  // Calculate EFFECTIVE votes for seat calculation
  // Opinion-forming: polls include these → remove when DISABLED to show fair scenario
  // Foreign votes: NOT in polls → ADD when ENABLED (slider value matters immediately)
  // Bidirectional biases: positive = Fidesz advantage, negative = Tisza advantage
  const effectiveVotes = useMemo((): VoteShare => {
    let adjustedFidesz = measuredVotes.fidesz
    let adjustedTisza = measuredVotes.tisza

    // 1. Process opinion-forming factors (remove bias when DISABLED)
    let fideszOpinionBiasRemoved = 0
    opinionFactors.filter(f => !f.enabled).forEach(f => {
      fideszOpinionBiasRemoved += f.value
    })

    if (fideszOpinionBiasRemoved > 0) {
      const otherTotal = adjustedTisza + measuredVotes.smallParty
      const newFidesz = Math.max(0, adjustedFidesz - fideszOpinionBiasRemoved)
      const redistributed = adjustedFidesz - newFidesz
      adjustedFidesz = newFidesz
      if (otherTotal > 0) {
        adjustedTisza += redistributed * adjustedTisza / otherTotal
      }
    }

    // 2. Process foreign votes (ADD when ENABLED - these are not in polls!)
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
      smallParty: measuredVotes.smallParty,
    }
  }, [measuredVotes, opinionFactors, voteFactors])

  const winner: "tisza" | "fidesz" = effectiveVotes.tisza >= effectiveVotes.fidesz ? "tisza" : "fidesz"

  // Check if small party passes the 5% parliamentary threshold
  const smallPartyPassesThreshold = measuredVotes.smallParty >= 5

  const proportionalSeats = useMemo((): PartySeats => {
    // Hungarian electoral law: parties below 5% threshold get no seats
    // Their votes are effectively "wasted" and seats are distributed among qualifying parties
    const qualifyingSmallParty = smallPartyPassesThreshold ? effectiveVotes.smallParty : 0
    const total = effectiveVotes.tisza + effectiveVotes.fidesz + qualifyingSmallParty
    if (total === 0) return { tisza: 0, fidesz: 0, smallParty: 0 }

    // Use largest remainder method (Hare-Niemeyer) to ensure seats sum to exactly 199
    // Note: Hungary uses D'Hondt for list seats, but for this simplified model we use largest remainder
    const exactTisza = TOTAL_SEATS * effectiveVotes.tisza / total
    const exactFidesz = TOTAL_SEATS * effectiveVotes.fidesz / total
    const exactSmallParty = smallPartyPassesThreshold ? TOTAL_SEATS * effectiveVotes.smallParty / total : 0

    let tisza = Math.floor(exactTisza)
    let fidesz = Math.floor(exactFidesz)
    let smallParty = Math.floor(exactSmallParty)

    // Distribute remaining seats by largest remainder
    const remainders = smallPartyPassesThreshold
      ? [
          { party: 'tisza', remainder: exactTisza - tisza },
          { party: 'fidesz', remainder: exactFidesz - fidesz },
          { party: 'smallParty', remainder: exactSmallParty - smallParty },
        ]
      : [
          { party: 'tisza', remainder: exactTisza - tisza },
          { party: 'fidesz', remainder: exactFidesz - fidesz },
        ]
    remainders.sort((a, b) => b.remainder - a.remainder)

    let remaining = TOTAL_SEATS - (tisza + fidesz + smallParty)
    for (const r of remainders) {
      if (remaining <= 0) break
      if (r.party === 'tisza') tisza++
      else if (r.party === 'fidesz') fidesz++
      else smallParty++
      remaining--
    }

    return { tisza, fidesz, smallParty }
  }, [effectiveVotes, smallPartyPassesThreshold])

  const finalSeats = useMemo((): PartySeats => {
    let fideszBias = 0
    let winnerBias = 0

    seatFactors.filter(f => f.enabled).forEach(f => {
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

  const handlePollChange = useCallback((party: keyof VoteShare, value: number) => {
    setMeasuredVotes(prev => ({ ...prev, [party]: value }))
  }, [])

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
                    measuredVotes={measuredVotes}
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
                <h2 className="text-lg font-semibold mb-6">
                {t.measuredPreferenceTitle}
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
    </div>
  )
}
