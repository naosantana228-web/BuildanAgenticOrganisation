import { describe, expect, it } from "vitest";
import { AGENT_DEFINITIONS } from "./definitions";

describe("agent architecture", () => {
  it("defines exactly the five required specialised innovation archetypes", () => {
    expect(AGENT_DEFINITIONS.map(agent => agent.name)).toEqual([
      "Researcher",
      "Designer",
      "Maker",
      "Communicator",
      "Manager",
    ]);
  });

  it("gives each agent a substantial prompt and structured handoff output", () => {
    for (const agent of AGENT_DEFINITIONS) {
      expect(agent.systemPrompt.length).toBeGreaterThan(250);
      expect(agent.personality.length).toBeGreaterThan(25);
      expect(agent.expertise.length).toBeGreaterThan(25);
      expect(agent.exampleOutput.decision.length).toBeGreaterThan(20);
      expect(agent.exampleOutput.handoffBrief.length).toBeGreaterThan(20);
      expect(agent.exampleOutput.deliverables.length).toBeGreaterThan(1);
    }
  });
});
