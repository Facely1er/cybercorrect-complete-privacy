import React from 'react';
import { useNavigate } from 'react-router-dom';
import Recommendations from '../../components/assessment/Recommendations';
import { generateRecommendationsPdf } from '../../utils/generatePdf';

const PrivacyRecommendations = () => {
  const navigate = useNavigate();
  
  const mockRecommendations = [
    {
      id: "pr1",
      title: "Implement Privacy by Design Framework",
      description: "Establish a formal Privacy by Design framework to ensure privacy considerations are embedded into all products, services, and business processes from the inception rather than added as an afterthought.",
      priority: "high",
      category: "Governance",
      effort: "significant",
      timeframe: "short-term",
      impact: "Privacy by Design creates a proactive approach to privacy that prevents issues rather than addressing them reactively, reducing overall privacy risk.",
      steps: [
        "Develop Privacy by Design principles adapted to your organization",
        "Create privacy design templates and patterns for development teams",
        "Implement privacy reviews at key stages of the development lifecycle",
        "Train product managers, developers and other relevant staff",
        "Update project management methodologies to include privacy checkpoints",
        "Develop metrics to measure the effectiveness of Privacy by Design implementation"
      ],
      references: [
        {
          title: "NIST Privacy Framework",
          url: "https://www.nist.gov/privacy-framework"
        },
        {
          title: "Information Commissioner's Office - Privacy by Design",
          url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-by-design-and-default/"
        }
      ]
    },
    {
      id: "pr2",
      title: "Establish Data Minimization Program",
      description: "Implement a formal data minimization program to ensure only necessary personal data is collected, processed, and retained for the specific purpose required.",
      priority: "critical",
      category: "Data Protection",
      effort: "significant",
      timeframe: "short-term",
      impact: "Data minimization reduces privacy risk exposure by limiting the personal data collected and retained, directly reducing potential harm from breaches and unauthorized access.",
      steps: [
        "Inventory all personal data collection points in the organization",
        "Map data collected against business requirements and legal bases",
        "Identify unnecessary data collection and processing",
        "Implement technical controls to limit data collection",
        "Develop data retention schedules and automated deletion mechanisms",
        "Train staff on data minimization principles",
        "Conduct regular audits of data collection practices"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Control Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "Article 5 GDPR - Principles relating to processing of personal data",
          url: "https://gdpr-info.eu/art-5-gdpr/"
        }
      ]
    },
    {
      id: "pr3",
      title: "Develop Comprehensive Data Subject Request Handling Process",
      description: "Create a formal process for receiving, tracking, validating, and fulfilling data subject requests (access, correction, deletion, etc.) in compliance with applicable privacy laws.",
      priority: "high",
      category: "Individual Rights",
      effort: "moderate",
      timeframe: "immediate",
      impact: "A streamlined data subject request process ensures compliance with privacy regulations and builds trust with individuals whose data is processed.",
      steps: [
        "Create standardized intake forms for different types of data subject requests",
        "Establish identity verification procedures",
        "Document the workflow for handling each type of request",
        "Implement tracking mechanisms with response timeframes",
        "Develop templates for responses to common requests",
        "Train staff involved in handling requests",
        "Implement systems to execute data subject requests across all systems"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Communicate Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "IAPP Privacy Tech Vendor Report - DSR Management",
          url: "https://iapp.org/resources/article/privacy-tech-vendor-report/"
        }
      ]
    },
    {
      id: "pr4",
      title: "Implement Privacy Risk Assessment Process",
      description: "Establish a formal privacy risk assessment process (like a Data Protection Impact Assessment) to identify and mitigate privacy risks before implementing new data processing activities.",
      priority: "high",
      category: "Risk Management",
      effort: "moderate",
      timeframe: "short-term",
      impact: "Privacy risk assessments enable early identification and mitigation of privacy risks, reducing the likelihood of privacy incidents and regulatory violations.",
      steps: [
        "Develop privacy risk assessment templates and methodology",
        "Define triggers for when assessments are required",
        "Establish a review process involving privacy professionals",
        "Create a database for tracking assessments and findings",
        "Implement remediation tracking for identified risks",
        "Train business units on conducting initial risk screenings",
        "Integrate with existing project approval workflows"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Identify Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "ICO Guidance on Data Protection Impact Assessments",
          url: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-impact-assessments/"
        }
      ]
    },
    {
      id: "pr5",
      title: "Develop Data Inventory and Processing Records",
      description: "Create and maintain a comprehensive inventory of all personal data and processing activities that documents data categories, purposes, legal bases, retention periods, and security controls.",
      priority: "critical",
      category: "Documentation",
      effort: "significant",
      timeframe: "immediate",
      impact: "A data inventory provides visibility into all personal data processing, enabling compliance with regulatory requirements and effective privacy risk management.",
      steps: [
        "Define the data inventory structure and required attributes",
        "Interview business units to identify data processing activities",
        "Document data flows, systems, and processing purposes",
        "Map legal bases to each processing activity",
        "Document retention periods and deletion procedures",
        "Implement a process for keeping the inventory current",
        "Use the inventory to drive compliance activities (e.g., privacy notices)"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Inventory and Mapping",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "Article 30 GDPR - Records of processing activities",
          url: "https://gdpr-info.eu/art-30-gdpr/"
        }
      ]
    },
    {
      id: "pr6",
      title: "Enhance Privacy Notice Framework",
      description: "Develop a comprehensive privacy notice framework that ensures clear, accurate, and accessible notices are provided for all personal data collection points.",
      priority: "medium",
      category: "Transparency",
      effort: "moderate",
      timeframe: "short-term",
      impact: "Improved privacy notices enhance transparency and build trust with individuals while ensuring regulatory compliance with notice requirements.",
      steps: [
        "Audit existing privacy notices and identify gaps",
        "Create notice templates for different contexts (websites, apps, forms, etc.)",
        "Implement layered notices with short- and long-form versions",
        "Ensure notices include all required elements (purposes, legal bases, rights, etc.)",
        "Test notice readability and comprehension",
        "Establish a process for keeping notices current as practices change",
        "Implement just-in-time notices at data collection points"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Communicate Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "FTC Guidance on Privacy Notices",
          url: "https://www.ftc.gov/business-guidance/privacy-security/privacy-promises"
        }
      ]
    },
    {
      id: "pr7",
      title: "Implement Privacy-Enhancing Technologies",
      description: "Deploy privacy-enhancing technologies (PETs) such as pseudonymization, anonymization, and encryption to protect personal data during processing and storage.",
      priority: "medium",
      category: "Data Protection",
      effort: "significant",
      timeframe: "medium-term",
      impact: "PETs reduce privacy risk through technical measures that minimize data exposure while enabling valuable data processing functions.",
      steps: [
        "Identify data processing activities suitable for PETs",
        "Evaluate and select appropriate PETs for different use cases",
        "Implement data pseudonymization for development and testing",
        "Deploy encryption for data at rest and in transit",
        "Establish anonymization processes for analytics and reporting",
        "Document how PETs are implemented and their effectiveness",
        "Train technical staff on PET implementation and maintenance"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Protect Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "ENISA Privacy Enhancing Technologies",
          url: "https://www.enisa.europa.eu/topics/data-protection/privacy-enhancing-technologies"
        }
      ]
    },
    {
      id: "pr8",
      title: "Establish Privacy Governance Committee",
      description: "Create a cross-functional privacy governance committee to oversee the organization's privacy program, set priorities, and ensure privacy initiatives align with business objectives.",
      priority: "low",
      category: "Governance",
      effort: "minimal",
      timeframe: "short-term",
      impact: "A formal governance structure ensures privacy receives appropriate attention, resources, and integration with business operations.",
      steps: [
        "Define the committee charter, roles, and responsibilities",
        "Identify key stakeholders from across the organization",
        "Establish meeting cadence and reporting structure",
        "Develop privacy program metrics and KPIs for oversight",
        "Create a privacy risk register for tracking",
        "Implement formal decision-making processes",
        "Document and communicate committee decisions and priorities"
      ],
      references: [
        {
          title: "NIST Privacy Framework - Govern Function",
          url: "https://www.nist.gov/privacy-framework/new-framework"
        },
        {
          title: "IAPP Privacy Program Management",
          url: "https://iapp.org/resources/article/privacy-program-management/"
        }
      ]
    }
  ];

  const handleExport = () => {
    generateRecommendationsPdf(
      'Privacy Implementation Recommendations',
      mockRecommendations as any,
      new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      'privacy-recommendations.pdf'
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Recommendations
        title="Privacy Implementation Recommendations"
        subtitle="Based on the NIST Privacy Framework and best practices"
        assessmentType="privacy"
        recommendations={mockRecommendations as any}
        onBack={() => navigate('/privacy-results')}
        onExport={handleExport}
      />
    </div>
  );
};

export default PrivacyRecommendations;