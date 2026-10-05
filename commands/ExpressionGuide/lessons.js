// Teaching examples checked against N.I.N.A. 3.3's Expression, UserSymbol,
// expression instructions, SymbolFunctions, ConditionalStrategy and LoopWhile.
module.exports = [
    {
        id: 'overview',
        title: 'Expressions: start here',
        introduction:
            'Learn to make sequence settings depend on calculations, named values and conditions. This private guide stays in Discord; you enter the examples in N.I.N.A. yourself.',
        sections: [
            {
                heading: 'What is an expression?',
                text: 'An expression calculates a value for an instruction or condition. For example, `30 * 2` calculates 60. A symbol supplies a named value; a function transforms values or makes a decision.'
            },
            {
                heading: 'Follow the learning path',
                text: 'Use **Next** to start with one expression, then learn symbols, variables, scope, functions and time. Finish with complete recipes and troubleshooting. The topic selector lets you jump directly to a lesson; **Overview** brings you back here.'
            },
            {
                heading: 'Before you begin',
                text: 'Use the **Advanced Sequencer in N.I.N.A. 3.3** and an expression-capable field. You can inspect simple calculations while editing. Running an equipment instruction still requires its normal connections and setup. Plugin instructions may offer different fields.\n\nThe examples focus on a few useful functions. The sequencer sidebar shows the symbols and functions available in your installed build.'
            }
        ]
    },
    {
        id: 'first-expression',
        title: 'Your first expression',
        introduction:
            'Start with arithmetic before adding symbols or device data. This example needs no user-defined symbols.',
        sections: [
            {
                heading: 'Where to enter it',
                text: '1. Add **Take Exposure** to an Advanced Sequencer instruction set.\n2. Replace its exposure-time value with the expression below.\n3. Leave the field and inspect the evaluated result. You do not need to run the exposure to inspect the calculation. A camera must be connected before you actually run it.'
            },
            {
                heading: 'Copy into the exposure-time field',
                text: '```text\n30 * 2\n```\n**Expected:** 60 seconds. The field supplies the unit, so enter numbers without `s` or `seconds`. Do not add a leading `=`.'
            },
            {
                heading: 'Read the result and try a change',
                text: 'The result annotation uses braces, such as `{60}`. Those displayed braces are not part of the expression you enter. Hover over an expression or warning icon for details.\n\n**Try:** Change the expression to `30 * 3`. Expect 90 seconds. Parentheses control grouping: `(30 + 10) * 2` gives 80.'
            }
        ]
    },
    {
        id: 'symbols',
        title: 'Symbols and constants',
        introduction:
            'A symbol is a name with a value. User definitions supply your own settings; read-only data symbols report values from N.I.N.A., equipment or plugins.',
        sections: [
            {
                heading: 'Setup: name a reusable exposure',
                text: 'In the Advanced Sequencer add **Define Constant**. Set **Name** to `ExposureSeconds` and **Value** to `60`. This literal constant is available throughout the sequence while editing; its definition does not need to execute first.\n\nIn a **Take Exposure** exposure-time field, enter:\n```text\nExposureSeconds * 2\n```\n**Expected:** 120 seconds. **Try:** Change the constant to 90 and expect 180. A running sequence cannot assign a new value to a constant.'
            },
            {
                heading: 'Names, numbers and text',
                text: "`ExposureSeconds` refers to the symbol. `60` is a number. Quoted text such as `'ExposureSeconds'` is a string, not a symbol reference, and does not belong in a numeric exposure field.\n\nUse clear names beginning with a letter and containing letters, digits or underscores. Preserve their exact spelling and capitalization."
            },
            {
                heading: 'Read live data',
                text: 'Open **Symbols** in the sequencer sidebar and click a name to copy it. For example:\n```text\nCamera.Temperature\n```\n**Where:** An expression-capable numeric field can read this value, but only use it where temperature is meaningful. The camera must be connected and report temperature. Data is read-only and can be unavailable before equipment connects or the first image is captured. Instructions use the available value when evaluated; the sidebar display refresh is separate.\n\n**Try:** Compare the symbol with the temperature reported by your camera.'
            }
        ]
    },
    {
        id: 'variables',
        title: 'Variables and execution',
        introduction:
            'Use a variable when the sequence needs to change a value. Declaring its name and executing its definition are different steps.',
        sections: [
            {
                heading: 'Setup: create a counter',
                text: '1. Add **Define Variable**, with **Name** `FrameCount` and **Initially** `0`.\n2. Place **Set Variable** after it, with **Variable** `FrameCount`.\n3. In the Set Variable **New Value** field, enter:\n```text\nFrameCount + 1\n```\nRun these instructions in order. **Expected:** The definition initializes 0; the assignment evaluates the old value plus 1 and stores 1. The definition then shows its **Currently** value.'
            },
            {
                heading: 'Why execution order matters',
                text: 'Before Define Variable runs, references can show an orange **not evaluated** warning. Set Variable needs the definition to have executed first. A red error means something else needs fixing.\n\nPlace initialization **outside** a loop that should accumulate a count. Running the definition again reinitializes it; resetting progress also clears its evaluated state.'
            },
            {
                heading: 'Stored values versus expressions',
                text: 'A variable initialized with another expression can retain that dependency. **Set Variable captures the evaluated result** at the time the assignment runs. Use it to store a measurement or timestamp that must stay fixed.\n\n**Try:** Execute Set Variable again without rerunning Define Variable. Expect 2. The recipe lesson shows how to do this inside a loop.'
            }
        ]
    },
    {
        id: 'scope',
        title: 'Scope and names',
        introduction:
            'Scope determines where a definition can be used. A nearer scoped definition takes precedence over an outer definition with the same name.',
        sections: [
            {
                heading: 'Setup: compare global and scoped variables',
                text: '**Define Variable** creates a global variable. **Define Scoped Variable** limits visibility to its containing set and nested sets. Scoped names do not become visible to sibling or enclosing sets. Execute a variable definition before using it.\n\n**Sequence layout, not an expression to paste:**\n```text\nSequence\n  Define Variable: ExposureSeconds, Initially 30\n  Set A\n    Define Scoped Variable: ExposureSeconds, Initially 60\n    Take Exposure: ExposureSeconds\n    Nested Set\n      Take Exposure: ExposureSeconds\n  Set B\n    Take Exposure: ExposureSeconds\n```'
            },
            {
                heading: 'Expected result and a change to try',
                text: 'With a camera connected, the exposures in Set A and its nested set use 60 seconds; Set B uses the global 30 seconds. The exposure-field expression is:\n```text\nExposureSeconds\n```\n**Try:** Change the scoped value to 90. Only Set A and its nested set change. Avoid duplicate names in one scope; use shadowing deliberately.'
            },
            {
                heading: 'Qualify device names',
                text: 'Copy exact names from the sidebar. `Camera.Temperature` identifies the provider and member, avoiding confusion with `Focuser.Temperature`. The legacy form `Camera_Temperature` remains supported. Function calls can likewise use `Math.Round(...)`.\n\nIf an older 3.3 build rejects dotted notation, use the spelling its sidebar supplies. A provider-qualified device name is different from the scope of your own sequence variables.'
            }
        ]
    },
    {
        id: 'functions',
        title: 'Functions and operators',
        introduction:
            'Call a function with parentheses and comma-separated arguments. Each argument supplies an input; the function returns a value.',
        sections: [
            {
                heading: 'Where to try these',
                text: 'No symbols or devices are needed for these calculations. Add **Define Constant**, give it a temporary name such as `PracticeResult` and enter each example in **Value**, one at a time. Inspect the result while editing.'
            },
            {
                heading: 'Limit, round and compare',
                text: '```text\nMath.Clamp(15, 1, 10)\n```\n**Expected:** 10. Arguments are value, lower bound and upper bound.\n```text\nMath.Round(3.222, 2)\n```\n**Expected:** 3.22. The second argument is the number of decimal places; exact midpoint ties use rounding to the nearest even value.\n```text\nMath.Between(5, 1, 10)\n```\n**Expected:** true, displayed numerically as 1. Both bounds are inclusive. **Try:** Replace 5 with 11 and expect false, or 0.'
            },
            {
                heading: 'Combine expressions',
                text: 'Arithmetic uses `+`, `-`, `*`, `/` and `%`. Comparisons such as `>=` and `==` produce true or false. Combine conditions with `&&` (and), `||` (or) and `!` (not). Use parentheses to make grouping clear.\n\nUse a decimal point in numeric literals and commas between arguments. The result must still fit the destination field: a boolean or string is not an exposure duration. Hover over a function in the sidebar to see its usage.'
            }
        ]
    },
    {
        id: 'decisions',
        title: 'Decisions and text',
        introduction:
            'Choosing a value and deciding whether instructions run are separate operations. These examples use only literals, so no symbols need defining.',
        sections: [
            {
                heading: 'Choose a value with Logic.If',
                text: '**Where:** A Take Exposure exposure-time field, or a temporary Define Constant value for practice.\n```text\nLogic.If(1 < 2, 60, 120)\n```\n**Expected:** 60. Arguments are condition, value when true and value when false. **Try:** Change `1 < 2` to `1 > 2`; expect 120. Running the exposure still requires a connected camera.'
            },
            {
                heading: 'Ask a question about text',
                text: "**Where:** A Conditional Instruction Set expression, or a temporary constant for inspection.\n```text\nString.Contains('HaRGB', 'Ha')\n```\n**Expected:** true (1). Text goes in straight quotes. Matching is case-sensitive: **try** `'ha'` instead of `'Ha'` and expect false (0). A quoted name is text; an unquoted name is a symbol reference."
            },
            {
                heading: 'Run once or keep looping?',
                text: '**Conditional Instruction Set:** Checks its expression when reached. True runs its contents once; false skips them. It has no own loop or trigger sections, although parent conditions and triggers still apply.\n\n**Loop While:** Attach it as a loop condition to a regular instruction set. It reevaluates during the run, including periodic checks, and can **interrupt** the current instruction when it becomes false. Do not assume it always waits for an exposure to finish.\n\nA condition must return a usable value. An expression error is not simply the same thing as false.'
            }
        ]
    },
    {
        id: 'time',
        title: 'Time and stored values',
        introduction:
            'Store the start time once, then compare later times with that stored value. Otherwise a changing time expression can keep moving your starting point.',
        sections: [
            {
                heading: 'Setup: capture a timestamp',
                text: '1. Add **Define Variable**, Name `RunStarted`, Initially `0`.\n2. After it add **Set Variable**, Variable `RunStarted`, and put this in **New Value**:\n```text\nTime.Now()\n```\n3. Execute both instructions before any consumer. **Expected:** Set Variable captures the current timestamp as a number. Put both setup instructions outside any loop that should share this starting time.'
            },
            {
                heading: 'Measure elapsed time',
                text: '**Where:** The expression field of a Conditional Instruction Set placed after initialization.\n```text\nTime.SecondsSince(RunStarted) >= 600\n```\n**Expected:** False until approximately ten minutes have elapsed. This conditional checks when reached; it does not wait for the time to arrive.\n\n**Try:** Use 10 instead of 600, wait more than ten seconds after capture and evaluate the condition again without resetting the variable.'
            },
            {
                heading: 'Timestamp units and a deadline',
                text: '`Time.Now()` returns **Unix seconds**, not milliseconds or a clock-hour number. Time formatting and date/time parts use **local time**. To calculate a timestamp ten minutes after the captured start, use:\n```text\nTime.AddMinutes(RunStarted, 10)\n```\nThis returns another timestamp, not a delay instruction. You can inspect it in another initialized variable using Set Variable.\n\nDo not initialize RunStarted directly with `Time.Now()` and assume it is frozen: a variable expression can retain a live dependency. Set Variable stores the evaluated result.'
            }
        ]
    },
    {
        id: 'recipes',
        title: 'Worked recipes',
        introduction:
            'Build these as separate practice sequences in the Advanced Sequencer. Each example declares all of its user symbols. Exposure examples need a connected camera or simulator.',
        sections: [
            {
                heading: 'Sequence layouts, not expressions to paste',
                text: 'Each line below names an instruction and its field values. Put only the expression after an indicated field label into that field in N.I.N.A.'
            },
            {
                heading: '1. Reuse one exposure setting',
                text: '**Setup and where:**\n```text\nDefine Constant: Name ExposureSeconds, Value 60\nTake Exposure: Exposure Time = ExposureSeconds\nTake Exposure: Exposure Time = ExposureSeconds * 2\n```\n**Copy into the second exposure-time field:**\n```text\nExposureSeconds * 2\n```\n**Expected:** 60 seconds then 120 seconds. **Try:** Change the constant to 30; both exposures become 30 and 60 seconds.'
            },
            {
                heading: '2. Count completed exposures',
                text: '**Setup and where:**\n```text\nDefine Variable: Name FrameCount, Initially 0\nSequential Instruction Set\n  Loop condition: Loop For Iterations = 3\n  Take Exposure: Exposure Time = 1\n  Set Variable: Variable FrameCount\n                New Value = FrameCount + 1\n```\n**Copy into Set Variable, New Value:**\n```text\nFrameCount + 1\n```\n**Expected:** After three successful exposures and assignments, FrameCount is 3. Keep Define Variable outside the repeating set or it resets each iteration. **Try:** Set the loop to 5 and expect 5 on a fresh run.'
            },
            {
                heading: '3. Measure a captured start time',
                text: '**Setup and where:**\n```text\nDefine Variable: Name RunStarted, Initially 0\nSet Variable: Variable RunStarted, New Value = Time.Now()\nWait for Time Span: 10 seconds\nConditional Instruction Set\n  Expression = Time.SecondsSince(RunStarted) >= 10\n  Take Exposure: Exposure Time = 1\n```\n**Copy into the conditional expression field:**\n```text\nTime.SecondsSince(RunStarted) >= 10\n```\n**Expected:** After the wait, the condition is true and the exposure runs once. **Try:** Use 20 in the comparison while leaving the wait at 10; if reached before 20 seconds have elapsed, the set is skipped. Keep time capture outside a loop when you want one start time for the whole run.'
            }
        ]
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting expressions',
        introduction:
            'Read the expression result and hover over its tooltip or warning icon before changing the formula. Fix the first failing dependency, then inspect the result again.',
        sections: [
            {
                heading: 'Find the kind of problem',
                text: '**Undefined:** Check exact spelling, capitalization and whether the symbol exists in this build.\n**Ambiguous:** Copy a provider-qualified name such as `Camera.Temperature` from the sidebar.\n**Not evaluated (orange):** A variable is declared but its definition has not executed. Ensure it runs before the consumer. Orange warnings can allow a sequence to start, but execution order still matters.\n**Red error:** Hover for the actual message. Invalid expressions fail validation and can prevent the affected instruction from running.'
            },
            {
                heading: 'Check context and inputs',
                text: '**Scope:** A scoped variable is visible only in its containing set and nested sets. A nearer definition can hide an outer one, even before the nearer variable executes.\n**Data:** Connect the device and check that it supplies the value. Image symbols may need an image first; plugin symbols need the plugin. An unavailable value is not proof of a zero reading.\n**Syntax:** Check parentheses, commas, decimal points and straight quotes. Remove copied result braces.\n**Type and range:** A valid calculation can still be unsuitable for a field. Check its units, numeric range and whether it expects a number or condition.'
            },
            {
                heading: 'A value keeps changing or resetting',
                text: 'Use Set Variable to capture an evaluated result. Keep a counter or timestamp initializer outside the loop that uses it. Check for duplicate or shadowed names and whether progress was reset.\n\n**Try:** Replace a complex expression with one literal, then restore one symbol or function at a time. For support, share the exact expression, tooltip text, relevant sequence section and N.I.N.A./plugin versions. `/logs` locates the session log.'
            }
        ]
    }
];
