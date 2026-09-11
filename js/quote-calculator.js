/**
 * HK Logistic Sp. z o.o - B2B Warehousing & Distribution Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuoteCalculator();
});

function initQuoteCalculator() {
  const calcRoot = document.getElementById('logisticsCalculator');
  if (!calcRoot) return;

  const palletSlider = calcRoot.querySelector('#calcPallets');
  const palletDisplay = calcRoot.querySelector('#palletValueDisplay');
  const serviceTypeSelect = calcRoot.querySelector('#calcServiceType');
  const tempSelect = calcRoot.querySelector('#calcTemp');
  const turnoverSelect = calcRoot.querySelector('#calcTurnover');

  // Outputs
  const outFootprint = calcRoot.querySelector('#outFootprint');
  const outCostRange = calcRoot.querySelector('#outCostRange');
  const outHandling = calcRoot.querySelector('#outHandling');
  const outCo2 = calcRoot.querySelector('#outCo2');

  const updateCalculations = () => {
    const pallets = parseInt(palletSlider.value, 10);
    palletDisplay.textContent = `${pallets.toLocaleString()} Pallets`;

    const service = serviceTypeSelect.value;
    const temp = tempSelect.value;
    const turnover = parseFloat(turnoverSelect.value || '1');

    // Base storage rate per pallet/month (benchmark enterprise rates)
    let baseRatePerPallet = 18.5; // Ambient shared benchmark
    if (service === 'dedicated') baseRatePerPallet = 16.0;
    if (service === 'cold-chain') baseRatePerPallet = 32.0;
    if (service === 'copacking') baseRatePerPallet = 24.0;
    if (service === 'integrated') baseRatePerPallet = 28.5;

    // Temperature multiplier
    let tempMultiplier = 1.0;
    if (temp === 'climate') tempMultiplier = 1.25;
    if (temp === 'cold') tempMultiplier = 1.65;
    if (temp === 'frozen') tempMultiplier = 2.1;

    // Estimated sq.ft (Standard 1.4 pallet footprint with aisle & staging factor = 12.5 sq.ft per pallet position)
    const estimatedSqft = Math.round(pallets * 12.8);
    const estimatedSqm = Math.round(estimatedSqft * 0.092903);

    // Monthly storage range
    const monthlyBase = pallets * baseRatePerPallet * tempMultiplier;
    const lowEst = Math.round(monthlyBase * 0.92);
    const highEst = Math.round(monthlyBase * 1.12);

    // Handling inbound/outbound
    const palletMovements = Math.round(pallets * turnover);
    const handlingEst = Math.round(palletMovements * 4.75);

    // CO2 savings via multi-client consolidation
    const co2SavedKg = Math.round(pallets * 1.85);

    // Update DOM
    if (outFootprint) {
      outFootprint.innerHTML = `<strong>${estimatedSqft.toLocaleString()} sq.ft</strong> <span>(~${estimatedSqm.toLocaleString()} m²)</span>`;
    }
    if (outCostRange) {
      outCostRange.textContent = `$${lowEst.toLocaleString()} – $${highEst.toLocaleString()} / mo`;
    }
    if (outHandling) {
      outHandling.textContent = `~${palletMovements.toLocaleString()} pallet moves/mo ($${handlingEst.toLocaleString()})`;
    }
    if (outCo2) {
      outCo2.textContent = `-${co2SavedKg.toLocaleString()} kg CO2e / mo saved`;
    }
  };

  palletSlider.addEventListener('input', updateCalculations);
  serviceTypeSelect.addEventListener('change', updateCalculations);
  tempSelect.addEventListener('change', updateCalculations);
  turnoverSelect.addEventListener('change', updateCalculations);

  updateCalculations();
}
