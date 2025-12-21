import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ArtifactsIndex from '../ArtifactsIndex'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileText: () => <span data-testid="file-text-icon">FileText</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  AlertTriangle: () => <span data-testid="alert-triangle-icon">AlertTriangle</span>,
  UserCheck: () => <span data-testid="user-check-icon">UserCheck</span>,
  BarChart: () => <span data-testid="bar-chart-icon">BarChart</span>,
  Map: () => <span data-testid="map-icon">Map</span>,
  ClipboardList: () => <span data-testid="clipboard-list-icon">ClipboardList</span>,
  FileCheck: () => <span data-testid="file-check-icon">FileCheck</span>,
  Lock: () => <span data-testid="lock-icon">Lock</span>,
  Cookie: () => <span data-testid="cookie-icon">Cookie</span>,
  Scale: () => <span data-testid="scale-icon">Scale</span>,
  FileWarning: () => <span data-testid="file-warning-icon">FileWarning</span>,
}))

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <ArtifactsIndex />
    </BrowserRouter>
  )
}

describe('ArtifactsIndex', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      
      expect(screen.getByText('Artifact Documents')).toBeInTheDocument()
    })

    it('should render the page title', () => {
      renderComponent()
      
      const title = screen.getByRole('heading', { name: /artifact documents/i })
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-4xl', 'font-bold')
    })

    it('should render the page description', () => {
      renderComponent()
      
      expect(screen.getByText(/Access complete artifact documents and templates/i)).toBeInTheDocument()
    })
  })

  describe('Artifact Categories', () => {
    it('should display all artifact categories', () => {
      renderComponent()
      
      expect(screen.getByText('Privacy Toolkit Pro')).toBeInTheDocument()
      expect(screen.getByText('GDPR Complete Kit')).toBeInTheDocument()
      expect(screen.getByText('Compliance Assessment Suite')).toBeInTheDocument()
      expect(screen.getByText('Compliance Framework Templates')).toBeInTheDocument()
    })

    it('should group artifacts by category', () => {
      renderComponent()
      
      const categories = screen.getAllByText(/Privacy Toolkit Pro|GDPR Complete Kit|Compliance Assessment Suite|Compliance Framework Templates/i)
      expect(categories.length).toBeGreaterThan(0)
    })
  })

  describe('Artifact Cards', () => {
    it('should render all artifact cards', () => {
      renderComponent()
      
      expect(screen.getByText('DPIA Generator Sample')).toBeInTheDocument()
      expect(screen.getByText('Data Breach Notification Template')).toBeInTheDocument()
      expect(screen.getByText('Data Subject Rights Request Manager')).toBeInTheDocument()
      expect(screen.getByText('Gap Analysis Report Sample')).toBeInTheDocument()
      expect(screen.getByText('Compliance Roadmap Generator')).toBeInTheDocument()
      expect(screen.getByText('Gap Analysis Worksheet')).toBeInTheDocument()
      expect(screen.getByText('Evidence Collection Checklist')).toBeInTheDocument()
    })

    it('should display artifact descriptions', () => {
      renderComponent()
      
      expect(screen.getByText(/Comprehensive Data Protection Impact Assessment/i)).toBeInTheDocument()
      expect(screen.getByText(/Complete GDPR Article 33\/34 breach notification/i)).toBeInTheDocument()
      expect(screen.getByText(/Interactive DSR management interface/i)).toBeInTheDocument()
    })

    it('should render artifact icons', () => {
      renderComponent()
      
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument()
      expect(screen.getByTestId('user-check-icon')).toBeInTheDocument()
      expect(screen.getByTestId('bar-chart-icon')).toBeInTheDocument()
    })

    it('should render "View Full Document" buttons for each artifact', () => {
      renderComponent()
      
      const viewButtons = screen.getAllByRole('link', { name: /view full document/i })
      expect(viewButtons.length).toBe(7) // 7 artifacts total
    })
  })

  describe('Navigation Links', () => {
    it('should have correct routes for artifact links', () => {
      renderComponent()
      
      const links = screen.getAllByRole('link', { name: /view full document/i })
      expect(links.length).toBeGreaterThan(0)
      const dpiaLink = links.find(link => link.getAttribute('href') === '/artifacts/dpia-generator')
      expect(dpiaLink).toBeInTheDocument()
    })

    it('should have links to all artifact routes', () => {
      renderComponent()
      
      const links = screen.getAllByRole('link')
      const hrefs = links.map(link => link.getAttribute('href'))
      
      expect(hrefs).toContain('/artifacts/dpia-generator')
      expect(hrefs).toContain('/artifacts/breach-notification')
      expect(hrefs).toContain('/artifacts/dsr-manager')
      expect(hrefs).toContain('/artifacts/gap-analysis-report')
      expect(hrefs).toContain('/artifacts/compliance-roadmap')
      expect(hrefs).toContain('/artifacts/gap-analysis-worksheet')
      expect(hrefs).toContain('/artifacts/evidence-checklist')
    })
  })

  describe('About Section', () => {
    it('should render the about section', () => {
      renderComponent()
      
      expect(screen.getByText('About Artifact Documents')).toBeInTheDocument()
    })

    it('should display artifact features list', () => {
      renderComponent()
      
      expect(screen.getByText(/Full content and detailed sections/i)).toBeInTheDocument()
      expect(screen.getByText(/PDF export capabilities/i)).toBeInTheDocument()
      expect(screen.getByText(/Compliance checklists and validation/i)).toBeInTheDocument()
      expect(screen.getByText(/Framework-specific requirements/i)).toBeInTheDocument()
      expect(screen.getByText(/Best practices and guidance/i)).toBeInTheDocument()
    })
  })

  describe('Category Grouping', () => {
    it('should group DPIA Generator under Privacy Toolkit Pro', () => {
      renderComponent()
      
      const privacyToolkitSection = screen.getByText('Privacy Toolkit Pro').closest('div')
      expect(privacyToolkitSection).toBeInTheDocument()
      expect(privacyToolkitSection?.textContent).toContain('DPIA Generator Sample')
    })

    it('should group breach notification and DSR manager under GDPR Complete Kit', () => {
      renderComponent()
      
      const gdprSection = screen.getByText('GDPR Complete Kit').closest('div')
      expect(gdprSection).toBeInTheDocument()
      expect(gdprSection?.textContent).toContain('Data Breach Notification Template')
      expect(gdprSection?.textContent).toContain('Data Subject Rights Request Manager')
    })

    it('should group gap analysis and roadmap under Compliance Assessment Suite', () => {
      renderComponent()
      
      const complianceSection = screen.getByText('Compliance Assessment Suite').closest('div')
      expect(complianceSection).toBeInTheDocument()
      expect(complianceSection?.textContent).toContain('Gap Analysis Report Sample')
      expect(complianceSection?.textContent).toContain('Compliance Roadmap Generator')
    })

    it('should group worksheet and checklist under Compliance Framework Templates', () => {
      renderComponent()
      
      const frameworkSection = screen.getByText('Compliance Framework Templates').closest('div')
      expect(frameworkSection).toBeInTheDocument()
      expect(frameworkSection?.textContent).toContain('Gap Analysis Worksheet')
      expect(frameworkSection?.textContent).toContain('Evidence Collection Checklist')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent()
      
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Artifact Documents')
      
      const h2s = screen.getAllByRole('heading', { level: 2 })
      expect(h2s.length).toBeGreaterThan(0)
    })

    it('should have accessible links', () => {
      renderComponent()
      
      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href')
      })
    })

    it('should have semantic structure', () => {
      const { container } = renderComponent()
      
      const cards = container.querySelectorAll('[class*="Card"]')
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Layout and Styling', () => {
    it('should have responsive grid layout', () => {
      const { container } = renderComponent()
      
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('should have proper container styling', () => {
      const { container } = renderComponent()
      
      const mainContainer = container.querySelector('.container')
      expect(mainContainer).toBeInTheDocument()
      expect(mainContainer).toHaveClass('mx-auto', 'px-4', 'py-8')
    })
  })

  describe('Icon Display', () => {
    it('should display icons for all artifacts', () => {
      renderComponent()
      
      // Check that icons are rendered (they're mocked as test IDs)
      const icons = [
        'shield-icon',
        'alert-triangle-icon',
        'user-check-icon',
        'bar-chart-icon',
        'map-icon',
        'clipboard-list-icon',
        'file-check-icon'
      ]
      
      icons.forEach(iconId => {
        expect(screen.getByTestId(iconId)).toBeInTheDocument()
      })
    })
  })
})

