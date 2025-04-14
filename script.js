document.addEventListener('DOMContentLoaded', function() {
    const networkSelect = document.getElementById('network');
    const ussdCodeInput = document.getElementById('ussd-code');
    const dialBtn = document.getElementById('dial-btn');
    const ussdDisplay = document.getElementById('ussd-display');
    const networkCodesContainer = document.getElementById('network-codes');
    const networkIndicator = document.getElementById('network-indicator');
    const ussdInput = document.getElementById('ussd-input');
    const responseInput = document.getElementById('response-input');
    const sendResponseBtn = document.getElementById('send-response');
    
    // South African network USSD codes
    const saNetworkCodes = {
        mtn: {
            name: "MTN",
            color: "mtn",
            codes: {
                '*136#': {
                    name: "Balance & Airtime",
                    response: "Your MTN balance is R50.00\n1. Buy Airtime\n2. Buy Bundle\n3. Transfer Airtime\n4. Data Balance"
                },
                '*136*1#': {
                    name: "Buy Airtime",
                    response: "MTN Airtime Purchase\n1. R5\n2. R10\n3. R20\n4. Other Amount"
                },
                '*136*2#': {
                    name: "Buy Bundle",
                    response: "MTN Data Bundles\n1. Daily\n2. Weekly\n3. Monthly\n4. Night Owl"
                },
                '*136*5#': {
                    name: "Data Balance",
                    response: "Your remaining data: 1.2GB\nExpires: 15/05/2024"
                },
                '*123*1#': {
                    name: "Call Me Back",
                    response: "Enter number to request call back:"
                },
                '*123*2#': {
                    name: "Please Call Me",
                    response: "Enter number to notify:"
                },
                '*155#': {
                    name: "Customer Care",
                    response: "Connecting to MTN customer care..."
                }
            }
        },
        vodacom: {
            name: "Vodacom",
            color: "vodacom",
            codes: {
                '*111#': {
                    name: "Balance & Services",
                    response: "Your Vodacom balance is R75.00\n1. Buy Airtime\n2. Buy Bundle\n3. My Offers\n4. Customer Care"
                },
                '*111*1#': {
                    name: "Buy Airtime",
                    response: "Vodacom Airtime\n1. R10\n2. R20\n3. R50\n4. Other"
                },
                '*111*2#': {
                    name: "Buy Bundle",
                    response: "Vodacom Data Bundles\n1. Smartphone\n2. Router\n3. Night Surfer\n4. Video"
                },
                '*111*3#': {
                    name: "My Offers",
                    response: "Your current offers:\n1. 1GB + 60min @ R49\n2. 2GB @ R99"
                },
                '*135#': {
                    name: "Data Balance",
                    response: "Your remaining data: 500MB\nExpires: 20/05/2024"
                },
                '*140#': {
                    name: "Customer Care",
                    response: "Connecting to Vodacom support..."
                }
            }
        },
        telkom: {
            name: "Telkom",
            color: "telkom",
            codes: {
                '*180#': {
                    name: "Balance & Services",
                    response: "Your Telkom balance is R30.00\n1. Buy Airtime\n2. Buy Data\n3. Voice Services\n4. Help"
                },
                '*180*1#': {
                    name: "Buy Airtime",
                    response: "Telkom Airtime\n1. R10\n2. R20\n3. R50\n4. Other"
                },
                '*180*2#': {
                    name: "Buy Data",
                    response: "Telkom Data Bundles\n1. Daily\n2. Weekly\n3. Monthly\n4. Night Express"
                },
                '*180*3#': {
                    name: "Voice Services",
                    response: "1. Call Me Back\n2. Free Minutes\n3. International"
                },
                '*188#': {
                    name: "Data Balance",
                    response: "Your remaining data: 250MB\nExpires: 10/05/2024"
                },
                '*111#': {
                    name: "Customer Care",
                    response: "Connecting to Telkom support..."
                }
            }
        },
        cellc: {
            name: "Cell C",
            color: "cellc",
            codes: {
                '*147#': {
                    name: "Balance & Services",
                    response: "Your Cell C balance is R45.00\n1. Buy Airtime\n2. Buy Data\n3. My Rewards\n4. Customer Care"
                },
                '*147*1#': {
                    name: "Buy Airtime",
                    response: "Cell C Airtime\n1. R10\n2. R20\n3. R50\n4. Other"
                },
                '*147*2#': {
                    name: "Buy Data",
                    response: "Cell C Data Bundles\n1. Daily\n2. Weekly\n3. Monthly\n4. Night Express"
                },
                '*147*3#': {
                    name: "My Rewards",
                    response: "Your rewards:\n1. 100MB free data\n2. 20min free calls"
                },
                '*102#': {
                    name: "Data Balance",
                    response: "Your remaining data: 150MB\nExpires: 05/05/2024"
                },
                '*140#': {
                    name: "Customer Care",
                    response: "Connecting to Cell C support..."
                }
            }
        },
        rain: {
            name: "Rain",
            color: "rain",
            codes: {
                '*123#': {
                    name: "Balance & Services",
                    response: "Your Rain balance is R120.00\n1. Buy Data\n2. Check Usage\n3. Customer Care\n4. Account"
                },
                '*123*1#': {
                    name: "Buy Data",
                    response: "Rain Data Bundles\n1. 1GB @ R29\n2. 2GB @ R49\n3. 10GB @ R199"
                },
                '*123*2#': {
                    name: "Check Usage",
                    response: "Your data usage: 5GB/10GB\nValid until: 25/05/2024"
                },
                '*123*3#': {
                    name: "Customer Care",
                    response: "Connecting to Rain support..."
                },
                '*123*4#': {
                    name: "Account",
                    response: "1. Change Plan\n2. Payment\n3. Settings"
                }
            }
        }
    };
    
    // Current state for multi-step USSD sessions
    let currentSession = {
        network: null,
        code: null,
        step: 0,
        responses: []
    };
    
    // Network selection handler
    networkSelect.addEventListener('change', function() {
        const network = this.value;
        
        if (!network) {
            networkCodesContainer.innerHTML = '<p>Select a network to see available codes</p>';
            networkIndicator.textContent = '';
            networkIndicator.className = '';
            return;
        }
        
        // Update network indicator
        const networkInfo = saNetworkCodes[network];
        networkIndicator.textContent = networkInfo.name;
        networkIndicator.className = networkInfo.color;
        
        // Populate network-specific codes
        networkCodesContainer.innerHTML = '';
        Object.entries(networkInfo.codes).forEach(([code, info]) => {
            const button = document.createElement('button');
            button.className = 'network-btn';
            button.innerHTML = `
                <span class="network-icon ${networkInfo.color}-icon"></span>
                <span>${info.name}</span>
            `;
            button.setAttribute('data-code', code);
            button.addEventListener('click', function() {
                ussdCodeInput.value = code;
                dialBtn.click();
            });
            networkCodesContainer.appendChild(button);
        });
    });
    
    // Dial button click handler
    dialBtn.addEventListener('click', function() {
        const network = networkSelect.value;
        const ussdCode = ussdCodeInput.value.trim();
        
        if (!network) {
            alert('Please select a network provider');
            return;
        }
        
        if (!ussdCode) {
            alert('Please enter a USSD code');
            return;
        }
        
        // Validate USSD code format
        if (!/^\*[\d\*#]+#$/.test(ussdCode)) {
            alert('Invalid USSD code format. Must start with * and end with #');
            return;
        }
        
        // Start new USSD session
        currentSession = {
            network: network,
            code: ussdCode,
            step: 0,
            responses: []
        };
        
        // Simulate USSD response
        simulateUssd();
    });
    
    // Send response handler
    sendResponseBtn.addEventListener('click', function() {
        const response = responseInput.value.trim();
        if (!response) return;
        
        currentSession.responses.push(response);
        currentSession.step++;
        responseInput.value = '';
        
        simulateUssd();
    });
    
    function simulateUssd() {
        const networkInfo = saNetworkCodes[currentSession.network];
        const fullCode = buildFullCode();
        
        // Clear display for new session
        if (currentSession.step === 0) {
            ussdDisplay.innerHTML = '';
            
            // Add network header
            const header = document.createElement('p');
            header.textContent = `${networkInfo.name} USSD`;
            header.style.fontWeight = 'bold';
            header.style.marginBottom = '10px';
            ussdDisplay.appendChild(header);
            
            // Add divider
            const divider = document.createElement('hr');
            divider.style.borderColor = '#444';
            divider.style.margin = '10px 0';
            ussdDisplay.appendChild(divider);
        }
        
        // Get response based on network and code
        let response;
        if (networkInfo.codes[fullCode]) {
            response = networkInfo.codes[fullCode].response;
        } else {
            response = `The code ${fullCode} is not recognized for ${networkInfo.name}.`;
        }
        
        // Add response lines
        response.split('\n').forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            ussdDisplay.appendChild(p);
        });
        
        // Show/hide input based on whether response expects input
        if (response.includes(':')) {
            ussdInput.classList.remove('hidden');
            responseInput.focus();
        } else {
            ussdInput.classList.add('hidden');
        }
        
        // Scroll to display
        ussdDisplay.scrollTop = ussdDisplay.scrollHeight;
    }
    
    function buildFullCode() {
        let code = currentSession.code;
        
        // For codes that expect responses (like *123*1#)
        if (currentSession.responses.length > 0) {
            // Remove the # from the original code
            code = code.slice(0, -1);
            
            // Add responses separated by *
            currentSession.responses.forEach(response => {
                code += '*' + response;
            });
            
            // Add back the #
            code += '#';
        }
        
        return code;
    }
});