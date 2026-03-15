"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type FormState, type MealPlan } from "./types";
import { generateTourRows, calcFooter, nightsBetween } from "./utils";
import SectionCard from "./SectionCard";
import S1Context from "./S1Context";
import S2Commercial from "./S2Commercial";
import S3TripDetails from "./S3TripDetails";
import S4Guests from "./S4Guests";
import S5Accommodations from "./S5Accommodations";
import S6TourBox from "./S6TourBox";
import S7Inclusions from "./S7Inclusions";
import S8Notes from "./S8Notes";
import FormFooter from "./FormFooter";
import QuoteModal from "./QuoteModal";

const today = new Date().toISOString().slice(0, 10);
const todayCode = today.replace(/-/g, "").slice(2); // "260315"
const REQUEST_NUMBER = `VH${todayCode}EYN001`;

const INITIAL: FormState = {
  agencyId: null, agentName: "", status: "In Progress",
  receivedVia: "Email", requestDate: today, requestNumber: REQUEST_NUMBER,
  calcType: "Per Pax", markupType: "Per Pax", markupValue: 0, gelRate: 2.72,
  dateFrom: "", dateTo: "", mealPlan: "BB",
  adults: 2, numChildren: 0, childAges: [], cwb: 0, cnb: 0,
  hotels: [], tourRows: [],
  entryFees: [], mealInclusions: [], extras: [],
  itinerary: "", createdBy: "Eynur Ahmadov",
};

export default function NewRequestForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [showQuote, setShowQuote] = useState(false);

  const setF = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Auto-generate tour rows when trip dates change
  useEffect(() => {
    if (form.dateFrom && form.dateTo) {
      const rows = generateTourRows(form.dateFrom, form.dateTo);
      setF("tourRows", rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.dateFrom, form.dateTo]);

  const nights = nightsBetween(form.dateFrom, form.dateTo);

  const calc = useMemo(() =>
    calcFooter(
      form.hotels, form.tourRows,
      form.entryFees, form.mealInclusions, form.extras,
      form.gelRate, form.markupType, form.markupValue, form.adults,
    ),
    [form.hotels, form.tourRows, form.entryFees, form.mealInclusions, form.extras,
     form.gelRate, form.markupType, form.markupValue, form.adults],
  );

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* Page header */}
      <div style={{ padding: "24px 32px 16px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid #1E293B" }}>
        <Link href="/requests">
          <button type="button" style={{ background: "none", border: "1px solid #334155", borderRadius: 8, color: "#94A3B8", padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
            <ArrowLeft size={14} /> Back
          </button>
        </Link>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>New Request</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
            {form.requestNumber} · {form.status}
          </p>
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <SectionCard num={1} title="Context" subtitle="Agency, agent, request source">
          <S1Context
            agencyId={form.agencyId} setAgencyId={(v) => setF("agencyId", v)}
            agentName={form.agentName} setAgentName={(v) => setF("agentName", v)}
            status={form.status} setStatus={(v) => setF("status", v)}
            receivedVia={form.receivedVia} setReceivedVia={(v) => setF("receivedVia", v)}
            requestDate={form.requestDate} setRequestDate={(v) => setF("requestDate", v)}
            requestNumber={form.requestNumber}
          />
        </SectionCard>

        <SectionCard num={2} title="Commercial Terms" subtitle="Pricing, markup, exchange rate">
          <S2Commercial
            calcType={form.calcType} setCalcType={(v) => setF("calcType", v)}
            markupType={form.markupType} setMarkupType={(v) => setF("markupType", v)}
            markupValue={form.markupValue} setMarkupValue={(v) => setF("markupValue", v)}
            gelRate={form.gelRate} setGelRate={(v) => setF("gelRate", v)}
          />
        </SectionCard>

        <SectionCard num={3} title="Trip Details" subtitle="Travel dates, duration, meal plan">
          <S3TripDetails
            dateFrom={form.dateFrom} setDateFrom={(v) => setF("dateFrom", v)}
            dateTo={form.dateTo} setDateTo={(v) => setF("dateTo", v)}
            mealPlan={form.mealPlan} setMealPlan={(v) => setF("mealPlan", v as MealPlan)}
          />
        </SectionCard>

        <SectionCard num={4} title="Guests" subtitle="Adults, children, pax breakdown">
          <S4Guests
            adults={form.adults} setAdults={(v) => setF("adults", v)}
            numChildren={form.numChildren} setChildren={(v) => setF("numChildren", v)}
            childAges={form.childAges} setChildAges={(v) => setF("childAges", v)}
            cwb={form.cwb} setCwb={(v) => setF("cwb", v)}
            cnb={form.cnb} setCnb={(v) => setF("cnb", v)}
          />
        </SectionCard>

        <SectionCard num={5} title="Accommodations" subtitle="Hotels, rooms, rates in USD">
          <S5Accommodations
            hotels={form.hotels} setHotels={(v) => setF("hotels", v)}
            defaultCheckIn={form.dateFrom} defaultCheckOut={form.dateTo}
            defaultMealPlan={form.mealPlan} adults={form.adults} cwb={form.cwb}
            gelRate={form.gelRate}
          />
        </SectionCard>

        <SectionCard num={6} title="Tour Box" subtitle="Day-by-day transfers and tours">
          <S6TourBox
            tourRows={form.tourRows} setTourRows={(v) => setF("tourRows", v)}
            dateFrom={form.dateFrom} dateTo={form.dateTo} gelRate={form.gelRate}
          />
        </SectionCard>

        <SectionCard num={7} title="Inclusions" subtitle="Entry fees, meals, extras">
          <S7Inclusions
            entryFees={form.entryFees} setEntryFees={(v) => setF("entryFees", v)}
            mealInclusions={form.mealInclusions} setMealInclusions={(v) => setF("mealInclusions", v)}
            extras={form.extras} setExtras={(v) => setF("extras", v)}
            adults={form.adults} nights={nights} gelRate={form.gelRate}
          />
        </SectionCard>

        <SectionCard num={8} title="Internal Notes" subtitle="Itinerary, created by">
          <S8Notes
            itinerary={form.itinerary} setItinerary={(v) => setF("itinerary", v)}
            createdBy={form.createdBy}
          />
        </SectionCard>
      </div>

      <FormFooter
        calc={calc}
        onGenerateQuote={() => setShowQuote(true)}
        onSaveDraft={() => alert("Draft saved! (Database integration pending)")}
        onConfirmBooking={() => alert("Booking confirmed! (Database integration pending)")}
      />

      {showQuote && (
        <QuoteModal form={form} sellingPrice={calc.sellingPrice} onClose={() => setShowQuote(false)} />
      )}
    </div>
  );
}
