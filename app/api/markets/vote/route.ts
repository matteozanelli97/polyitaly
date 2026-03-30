import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { marketId, position } = await req.json();

    if (!marketId || !["yes", "no"].includes(position)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const db = getServiceClient();

    // Get current market
    const { data: market } = await db
      .from("markets")
      .select("*")
      .eq("id", marketId)
      .eq("status", "open")
      .single();

    if (!market) {
      return NextResponse.json(
        { error: "Market not found or closed" },
        { status: 404 }
      );
    }

    // Update votes and recalculate probability
    const newVotesYes =
      market.votes_yes + (position === "yes" ? 1 : 0);
    const newVotesNo =
      market.votes_no + (position === "no" ? 1 : 0);
    const totalVotes = newVotesYes + newVotesNo;

    // AMM-style: prob_yes = pool_yes / (pool_yes + pool_no)
    // Using votes as a simple proxy
    const newProbYes = totalVotes > 0 ? newVotesYes / totalVotes : 0.5;

    await db
      .from("markets")
      .update({
        votes_yes: newVotesYes,
        votes_no: newVotesNo,
        prob_yes: newProbYes,
        volume_pts: totalVotes,
      })
      .eq("id", marketId);

    return NextResponse.json({
      prob_yes: newProbYes,
      votes_yes: newVotesYes,
      votes_no: newVotesNo,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
