import React from 'react';
import { useNavigate } from 'react-router-dom';
import Recommendations from '../../components/assessment/Recommendations';
import { generateRecommendationsPdf } from '../../utils/generatePdf';

const CuiRecommendations = () => {
  const navigate = useNavigate();
  
  const mockRecommendations = [
    {
      id: "cui1",
      title: "Implement System Security Plan for CUI Environment",
      description: "Develop a comprehensive System Security Plan (SSP) that documents the implementation of NIST SP 800-171 controls for systems handling Controlled Unclassified Information.",
      priority: "critical",
      category: "Governance",
      effort: "significant",
      timeframe: "immediate",
      impact: "An SSP provides a foundational document that maps security requirements to implementations and identifies gaps requiring remediation.",
      steps: [
        "Identify all systems that process, store, or transmit CUI",
        "Document the security requirements applicable to those systems",
        "Map implemented controls to NIST SP 800-171 requirements",
        "Document current implementation status for each requirement",
        "Develop Plans of Action & Milestones (POA&Ms) for any gaps",
        "Establish a process for regular SSP review and updates"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Protecting CUI in Nonfederal Systems and Organizations",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "NIST SP 800-171A - Assessing Security Requirements for Controlled Unclassified Information",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171a/final"
        }
      ]
    },
    {
      id: "cui2",
      title: "Implement Multifactor Authentication",
      description: "Deploy multifactor authentication for all accounts accessing systems containing CUI, particularly for privileged accounts and remote access.",
      priority: "critical",
      category: "Access Control",
      effort: "moderate",
      timeframe: "immediate",
      impact: "MFA significantly reduces the risk of unauthorized access through compromised credentials.",
      steps: [
        "Identify all access points to CUI systems",
        "Select an MFA solution compatible with your environment",
        "Implement MFA for privileged accounts first",
        "Extend MFA to all user accounts accessing CUI",
        "Document exceptions with compensating controls where MFA cannot be implemented",
        "Configure monitoring for authentication failures and bypass attempts"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control 3.5.3",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "CMMC 2.0 Practice IA.L2-3.5.3",
          url: "https://dodcio.defense.gov/CMMC/"
        }
      ]
    },
    {
      id: "cui3",
      title: "Implement Security Assessment Processes",
      description: "Establish a formal security assessment program to periodically evaluate the effectiveness of security controls protecting CUI.",
      priority: "high",
      category: "Security Assessment",
      effort: "significant",
      timeframe: "short-term",
      impact: "Regular assessments identify control weaknesses before they can be exploited and demonstrate due diligence in protecting CUI.",
      steps: [
        "Develop assessment procedures for each control family",
        "Establish assessment frequency based on system criticality",
        "Implement both self-assessments and independent assessments",
        "Document assessment methodology and acceptance criteria",
        "Create templates for assessment reporting",
        "Implement a process for tracking remediation of assessment findings"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control Family 3.12",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "NIST SP 800-53A Rev. 5 - Assessment Procedures",
          url: "https://csrc.nist.gov/publications/detail/sp/800-53a/rev-5/final"
        }
      ]
    },
    {
      id: "cui4",
      title: "Develop and Test Incident Response Plan",
      description: "Create an incident response plan specifically addressing CUI security incidents, including reporting requirements to DoD and other relevant authorities.",
      priority: "high",
      category: "Incident Response",
      effort: "moderate",
      timeframe: "short-term",
      impact: "A documented and tested incident response plan ensures rapid and effective handling of security incidents affecting CUI.",
      steps: [
        "Document roles and responsibilities for incident handling",
        "Develop procedures for incident identification, containment, and eradication",
        "Include specific steps for incidents involving CUI",
        "Document reporting requirements to external organizations",
        "Establish criteria for incident severity classification",
        "Conduct regular tabletop exercises to test the plan"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control Family 3.6",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "DFARS 252.204-7012 - Cybersecurity Incident Reporting Requirements",
          url: "https://www.acq.osd.mil/dpap/dars/dfars/html/current/252204.htm"
        }
      ]
    },
    {
      id: "cui5",
      title: "Implement Media Protection Controls",
      description: "Establish controls for the protection, sanitization, and destruction of media containing CUI throughout its lifecycle.",
      priority: "medium",
      category: "Data Protection",
      effort: "moderate",
      timeframe: "short-term",
      impact: "Proper media handling prevents unauthorized disclosure of CUI during use, storage, and disposal.",
      steps: [
        "Develop and document media protection policies and procedures",
        "Implement physical access controls for media containing CUI",
        "Establish secure methods for media sanitization and destruction",
        "Maintain records of media sanitization actions",
        "Train personnel on proper media handling procedures",
        "Implement controls for media transported outside controlled areas"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control Family 3.8",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "NIST SP 800-88 Rev. 1 - Guidelines for Media Sanitization",
          url: "https://csrc.nist.gov/publications/detail/sp/800-88/rev-1/final"
        }
      ]
    },
    {
      id: "cui6",
      title: "Implement System and Information Integrity Controls",
      description: "Establish technical controls to maintain system and information integrity, including flaw remediation, malicious code protection, and system monitoring.",
      priority: "high",
      category: "System Security",
      effort: "significant",
      timeframe: "medium-term",
      impact: "System integrity controls help prevent, detect, and correct information and system corruption due to errors or malicious actions.",
      steps: [
        "Implement automated flaw remediation processes",
        "Deploy malicious code protection mechanisms at system entry and exit points",
        "Configure real-time scanning of files from external sources",
        "Establish security-relevant system monitoring capabilities",
        "Implement automated tools to perform integrity checks",
        "Develop procedures for responding to integrity violations"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control Family 3.14",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "CISA Cybersecurity Best Practices",
          url: "https://www.cisa.gov/cybersecurity-best-practices"
        }
      ]
    },
    {
      id: "cui7",
      title: "Document CUI Data Flow and Handling Procedures",
      description: "Map and document the flow of CUI throughout your organization, including entry points, storage locations, processing systems, and transmission methods.",
      priority: "medium",
      category: "Documentation",
      effort: "moderate",
      timeframe: "medium-term",
      impact: "Understanding CUI data flows enables proper control placement and helps ensure consistent protection across the environment.",
      steps: [
        "Identify all sources of CUI entering the organization",
        "Map storage locations and systems processing CUI",
        "Document transmission methods and paths for CUI",
        "Create CUI handling procedures for each stage of the data lifecycle",
        "Implement CUI marking and identification requirements",
        "Train employees on CUI handling procedures"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Appendix A: CUI Security Requirements",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "CUI Registry - Information on Categories and Handling",
          url: "https://www.archives.gov/cui"
        }
      ]
    },
    {
      id: "cui8",
      title: "Develop and Document Configuration Management Plan",
      description: "Create a configuration management plan for systems containing CUI that addresses baseline configurations, change control, and configuration settings.",
      priority: "medium",
      category: "Configuration Management",
      effort: "moderate",
      timeframe: "medium-term",
      impact: "A formal configuration management program reduces security vulnerabilities by ensuring systems are properly configured and changes are controlled.",
      steps: [
        "Establish and document baseline configurations for CUI systems",
        "Develop change management procedures",
        "Implement configuration settings that reflect security requirements",
        "Restrict configuration changes to authorized personnel",
        "Maintain change logs and documentation",
        "Conduct periodic configuration audits"
      ],
      references: [
        {
          title: "NIST SP 800-171 Rev. 2 - Control Family 3.4",
          url: "https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final"
        },
        {
          title: "CIS Benchmarks for Secure Configuration",
          url: "https://www.cisecurity.org/cis-benchmarks/"
        }
      ]
    }
  ];

  const handleExport = () => {
    generateRecommendationsPdf(
      'CUI Protection Recommendations',
      mockRecommendations,
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      'cui-recommendations.pdf'
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Recommendations
        title="CUI Protection Recommendations"
        subtitle="Based on NIST SP 800-171 requirements for Controlled Unclassified Information"
        assessmentType="cui"
        recommendations={mockRecommendations}
        onBack={() => navigate('/cui-results')}
        onExport={handleExport}
      />
    </div>
  );
};

export default CuiRecommendations;