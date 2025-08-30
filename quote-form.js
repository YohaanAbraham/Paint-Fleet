document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.querySelector('.quote-form');
    
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) return;
        
        // Process form data
        const formData = gatherFormData();
        const estimateData = calculateEstimate(formData);
        
        // Store in sessionStorage for the estimate page
        sessionStorage.setItem('currentEstimate', JSON.stringify({
            formData: formData,
            calculations: estimateData
        }));
        
        // Redirect to estimate page
        window.location.href = 'estimate.html';
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = quoteForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--danger)';
                isValid = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields marked with *');
            return false;
        }
        
        // Validate metro area
        const metroInput = document.getElementById('metro-area');
        const metroValue = metroInput.value.trim();
        const metroExists = Object.keys(metroCostTiers).some(metro => 
            metro.toLowerCase() === metroValue.toLowerCase());
        
        if (!metroExists) {
            metroInput.style.borderColor = 'var(--danger)';
            alert('Please select a valid metropolitan area from the suggestions');
            return false;
        }
        
        return true;
    }

    function gatherFormData() {
        return {
            projectType: document.getElementById('project-type').value,
            propertyType: document.getElementById('property-type').value,
            rooms: parseInt(document.getElementById('rooms').value),
            sqft: parseFloat(document.getElementById('sqft').value),
            coats: parseInt(document.getElementById('coats').value),
            metro: document.getElementById('metro-area').value.trim(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            startDate: document.getElementById('start-date').value,
            urgency: document.querySelector('input[name="urgency"]:checked').value,
            description: document.getElementById('project-desc').value.trim()
        };
    }

    function calculateEstimate(formData) {
        // Constants from your algorithm
        const BASE_RATE_PER_SQ_FT = 2.00;
        const ROOM_FEE = 50;
        const COAT_MULTIPLIER = 1.35;
        const PAINT_COST_PER_GALLON = 40;
        const PAINT_COVERAGE_PER_GALLON = 350;
        const PRIMER_COST_PER_GALLON = 15;
        const PRIMER_COVERAGE_PER_GALLON = 300;
        const SUPPLIES_COST = 50;

        // Find exact metro match
        const metroMatch = Object.keys(metroCostTiers).find(metro => 
            metro.toLowerCase() === formData.metro.toLowerCase());
        const tier = metroCostTiers[metroMatch];
        
        // Determine metro multiplier
        let metroMultiplier;
        switch(tier) {
            case "High": metroMultiplier = 1.5; break;
            case "Medium": metroMultiplier = 1.25; break;
            default: metroMultiplier = 1.0; break;
        }

        // Calculate base costs
        const baseCost = formData.sqft * BASE_RATE_PER_SQ_FT;
        const roomCost = formData.rooms * ROOM_FEE;
        const coatAdjustment = formData.coats === 2 ? COAT_MULTIPLIER : 1;
        const adjustedBaseCost = baseCost * coatAdjustment;
        
        // Calculate total to customer
        const subtotalBeforeMaterials = (adjustedBaseCost + roomCost) * metroMultiplier;
        
        // Calculate material costs
        const paintRequired = (formData.sqft * formData.coats) / PAINT_COVERAGE_PER_GALLON;
        const primerRequired = formData.sqft / PRIMER_COVERAGE_PER_GALLON;
        const materialCosts = (paintRequired * PAINT_COST_PER_GALLON) + 
                            (primerRequired * PRIMER_COST_PER_GALLON) + 
                            SUPPLIES_COST;
        
        const totalToCustomer = subtotalBeforeMaterials + materialCosts;
        const profit = totalToCustomer - materialCosts;
        
        return {
            baseCost: baseCost,
            roomCost: roomCost,
            coatAdjustment: coatAdjustment,
            metroMultiplier: metroMultiplier,
            subtotalBeforeMaterials: subtotalBeforeMaterials,
            materialCosts: materialCosts,
            totalToCustomer: totalToCustomer,
            profit: profit,
            painterShare: profit * 0.7,
            appShare: profit * 0.3,
            tier: tier,
            estimateNumber: 'PF-' + Date.now().toString().slice(-6)
        };
    }
});
