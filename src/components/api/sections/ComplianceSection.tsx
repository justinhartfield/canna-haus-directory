
import React from 'react';
import ApiExample from '@/components/ApiExample';

const ComplianceSection: React.FC = () => {
  const complianceExample = `{
  "jurisdiction": {
    "country": "United States",
    "state": "Colorado",
    "lastUpdated": "2023-06-15T00:00:00Z"
  },
  "regulations": {
    "possession": {
      "recreational": {
        "limit": "28.5 grams",
        "minimumAge": 21,
        "notes": "Up to 28.5 grams of cannabis or 8 grams of concentrate"
      },
      "medical": {
        "limit": "56.7 grams",
        "minimumAge": 18,
        "requiresCard": true,
        "notes": "With valid medical marijuana card"
      }
    },
    "cultivation": {
      "recreational": {
        "allowed": true,
        "plantLimit": 6,
        "locationRestrictions": ["Must not be visible to public", "Must be in locked space"],
        "notes": "Maximum 3 mature plants, 3 immature plants"
      },
      "medical": {
        "allowed": true,
        "plantLimit": 12,
        "extendedCountPossible": true,
        "extendedCountProcess": "Doctor recommendation and registration",
        "notes": "Extended count available for specific medical needs"
      }
    },
    "purchasing": {
      "salesTax": 15,
      "dailyPurchaseLimit": "28.5 grams",
      "outOfStateCustomers": {
        "allowed": true,
        "restrictions": "Cannot transport across state lines"
      }
    },
    "consumption": {
      "publicConsumption": {
        "allowed": false,
        "penalty": "Fine up to $100",
        "exceptions": ["Licensed consumption lounges"]
      },
      "designatedAreas": {
        "exist": true,
        "types": ["Licensed lounges", "Private clubs"],
        "restrictions": "No alcohol service"
      }
    },
    "transportRestrictions": {
      "vehicleRequirements": "Closed container in trunk or inaccessible area",
      "quantityLimits": "Within possession limits",
      "crossingStateLinesProhibited": true
    }
  },
  "businessRequirements": {
    "licensing": {
      "types": ["Retail", "Medical", "Cultivation", "Manufacturing", "Testing"],
      "generalRequirements": [
        "Background check",
        "Financial disclosures",
        "Location approval",
        "Security plan"
      ],
      "fees": {
        "application": "$5,000 - $15,000",
        "renewal": "$3,000 - $10,000 annually",
        "variableBy": "License type and business size"
      }
    },
    "operationRequirements": {
      "seedToSaleTracking": {
        "required": true,
        "approvedSystems": ["Metrc"]
      },
      "security": {
        "videoSurveillance": {
          "required": true,
          "retentionPeriod": "40 days",
          "coverage": "All entrances, exits, point of sale, grow rooms"
        },
        "alarmSystems": {
          "required": true,
          "monitoring": "24/7 professional monitoring required"
        },
        "accessControl": {
          "visitorLogs": true,
          "employeeIdentification": true,
          "restrictedAreaProtocols": true
        }
      },
      "testing": {
        "required": true,
        "frequency": "Each harvest batch",
        "parameters": [
          "Potency",
          "Pesticides",
          "Heavy metals",
          "Residual solvents",
          "Microbiological contaminants"
        ]
      },
      "packaging": {
        "childResistant": true,
        "labelingRequirements": [
          "THC/CBD content",
          "Cultivation date",
          "Harvest date",
          "Testing date",
          "Warning statements",
          "Universal symbol"
        ],
        "environmentalRestrictions": "Environmentally responsible packaging encouraged"
      }
    }
  },
  "enforcementContact": {
    "agency": "Colorado Marijuana Enforcement Division",
    "phone": "303-205-8421",
    "website": "https://sbg.colorado.gov/marijuanaenforcement"
  }
}`;

  return (
    <section id="compliance" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Compliance API</h2>
      <p className="mb-6">
        Access detailed regulatory compliance information for different jurisdictions, including possession limits, 
        cultivation rules, business requirements, and enforcement contacts.
      </p>
      
      <div className="space-y-6">
        <ApiExample
          endpoint="/compliance/{state}"
          method="GET"
          description="Retrieve detailed compliance information for a specific state or jurisdiction."
          responseExample={complianceExample}
        />
      </div>

      <div className="glass-card rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-3">Compliance Data Categories</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 px-4 text-left font-semibold">Category</th>
              <th className="py-2 px-4 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Possession Regulations</td>
              <td className="py-3 px-4">Legal amounts, age restrictions, and differences between medical and recreational</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Cultivation Rules</td>
              <td className="py-3 px-4">Home growing permissions, plant counts, and location restrictions</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Purchasing Limits</td>
              <td className="py-3 px-4">Daily purchase amounts, taxes, and out-of-state customer rules</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Consumption Guidelines</td>
              <td className="py-3 px-4">Public consumption rules, designated areas, and penalties</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-3 px-4">Business Requirements</td>
              <td className="py-3 px-4">Licensing types, security requirements, and operational protocols</td>
            </tr>
            <tr>
              <td className="py-3 px-4">Testing Standards</td>
              <td className="py-3 px-4">Required lab tests, frequency, and specification limits</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ComplianceSection;
