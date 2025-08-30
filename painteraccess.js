// painterUseCase.js
const calculateQuote = require('./quoteCalculator'); // assumes quoteCalculator.js is in same directory

function runPainterUseCase() {
    // Sample input values (you can change these)
    const input = {
        rooms: 4,
        sqft: 1200,
        coats: 2,
        metroArea: "New York" // must be in metro_cost_tiers.json
    };

    try {
        const quote = calculateQuote(input);

        console.log("🎨 Painting Job Quote Breakdown:");
        console.log(`---------------------------------`);
        console.log(`Base Cost (sqft only):        $${quote.baseCost.toFixed(2)}`);
        console.log(`Total Cost to Customer:       $${quote.totalCustomerCost.toFixed(2)}`);
        console.log(`Internal Material Cost:       $${quote.internalCost.toFixed(2)}`);
        console.log(`Estimated Profit:             $${quote.profit.toFixed(2)}`);
        console.log(`→ Painter's Share (70%):      $${quote.painterShare.toFixed(2)}`);
        console.log(`→ App's Share (30%):          $${quote.appShare.toFixed(2)}`);
    } catch (err) {
        console.error(" Error calculating quote:", err.message);
    }
}

runPainterUseCase();
