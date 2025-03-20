
import React from 'react';

const LicensingSection: React.FC = () => {
  return (
    <section id="licensing" className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Licensing & Terms</h2>
      <p className="mb-6">
        Our data is available under different licensing terms depending on your intended use and subscription tier.
      </p>
      
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-3">Available Licenses</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Academic & Research License</h4>
            <p className="text-sm text-muted-foreground">
              For non-commercial academic and research purposes. Requires attribution and sharing of derived research.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Developer License</h4>
            <p className="text-sm text-muted-foreground">
              For building applications and services with our data. Has usage limitations and requires attribution.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Commercial License</h4>
            <p className="text-sm text-muted-foreground">
              For commercial applications and products. Includes broader usage rights with tiered pricing based on volume.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Enterprise License</h4>
            <p className="text-sm text-muted-foreground">
              Custom licensing terms for large-scale commercial use, including redistribution rights and dedicated support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LicensingSection;
