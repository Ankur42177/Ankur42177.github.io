---
title: Deep Agents Need Deep Evals: How Evaluation Makes LangChain Agents Reliable
date: 2026-10-24
summary: Deep Agents plan, write files and spawn subagents, so checking only the final answer isn't enough. A practical guide to single-step, full-turn and multi-turn evals for LangChain's deepagents.
tags: LangChain, Deep Agents, Evals, LangSmith, Agentic AI
category: tech
cover: /blog/deep-agents-evals.svg
coverAlt: Diagram of an agent calling tools with pass and fail checks
---

A simple LLM app takes an input and returns an output, so you can test it with a dataset and a single scorer. **Deep agents** are different. They plan, call tools across many steps, write to a filesystem and hand work off to subagents. If you only check the final message, you'll miss most of the ways they can go wrong.

## What a Deep Agent is

[`deepagents`](https://docs.langchain.com/oss/python/deepagents/overview) is LangChain's *agent harness*: the tool-calling loop plus the built-in capabilities that long, multi-step tasks need. It runs on the LangGraph runtime.

```python
from deepagents import create_deep_agent

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search_tickets, query_db],
    system_prompt="You are a triage assistant for endpoint security escalations.",
)
```

Out of the box it comes with:

- **A virtual filesystem**: `ls`, `read_file`, `write_file`, `edit_file`, `glob` and `grep`, for notes and working memory.
- **Subagents** through a `task` tool. Each subagent gets its own isolated context.
- **Planning** with `write_todos`, which you can turn on through `TodoListMiddleware`.
- **Human-in-the-loop** approvals with `interrupt_on`.

All of that power is exactly why evaluation gets harder.

## Why classic evals fall short

LangChain's team [evaluated four production agents built on Deep Agents](https://www.langchain.com/blog/evaluating-deep-agents-our-learnings) and found that each test case often needs **its own success criteria**. For example, if you tell a scheduling agent *"never book meetings before 9 AM"*, a good run should:

1. call `edit_file` to save that rule to its memory file,
2. confirm the change to the user, and
3. leave the file actually containing the rule.

No single generic scorer checks all three. You need **code-based assertions written for each test case**.

## Three levels of evaluation

### 1. Single-step evals: test the decision

Run the agent for **one step** and check what it *decided* to do: which tool it picked and with what arguments. With LangGraph you can pause before the tools run and inspect the planned call.

```python
# run_single_step: your own helper that runs the graph until it's
# interrupted before the tools node, then returns the planned calls
def test_saves_preference():
    step = run_single_step(agent, history=[user("Never book before 9 AM")])
    call = step.tool_calls[0]
    assert call.name == "edit_file"
    assert "9" in call.args["new_string"]
```

These tests are **fast and cheap**, and they catch most routing mistakes. LangChain reported that about half of their test cases were single-step.

### 2. Full-turn evals: test the outcome

Run a complete turn, then check three things:

- **Trajectory**: was the right tool called at some point, regardless of the exact order?
- **Final response**: is the answer correct and useful? This matters most for open-ended work like coding or research, and an LLM-as-judge often helps here.
- **State**: were the right files, records or artifacts actually created?

### 3. Multi-turn evals: test the conversation

Fixed scripts break as soon as the agent takes a different but still valid path. A better approach is to **check after each turn, continue only if it matches expectations, and fail early otherwise**. To test a later turn on its own, start from a prepared state instead of replaying the whole conversation.

## Make the environment reproducible

Agents that touch files, shells or APIs need a **clean environment for every test**, such as a fresh temporary directory or a container, or results become flaky. For external APIs, **record HTTP traffic once and replay it** (for example with `vcr` in Python). Tests become faster, cheaper and deterministic.

## Wire it into LangSmith

LangSmith's **pytest** (and Vitest) integration lets you write normal tests with custom assertions while it records inputs, outputs and traces for every run, grouped into experiments. When a test fails, you can open the trace and see exactly which step went wrong, then compare results across prompt or model changes over time.

## How evals actually help the agent

- **Catch regressions** when you change a prompt, model or tool.
- **Find the real failure point.** Was it planning, tool choice, the arguments or the final summary?
- **Ship with confidence.** Every change is measured against the same test cases.
- **Build a feedback loop.** Failures in production become new test cases.

## The takeaway

For deep agents, the final answer is only part of the story. **Test the decisions, the trajectory and the end state**, in a reproducible environment, and treat evals as part of the agent rather than an afterthought.

*References: [LangChain: Evaluating Deep Agents: Our Learnings](https://www.langchain.com/blog/evaluating-deep-agents-our-learnings) · [Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview)*
