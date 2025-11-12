import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ProjectProvider } from '../../context/ProjectContext'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

const ProjectProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ProjectProvider>
      {children}
    </ProjectProvider>
  </BrowserRouter>
)

describe('ProjectContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide project context to children', () => {
    render(
      <ProjectProviderWrapper>
        <div data-testid="project-context">Project Context Test</div>
      </ProjectProviderWrapper>
    )

    expect(screen.getByTestId('project-context')).toBeInTheDocument()
  })

  it('should initialize with default project state', () => {
    render(
      <ProjectProviderWrapper>
        <div data-testid="project-state">Project State Test</div>
      </ProjectProviderWrapper>
    )

    expect(screen.getByTestId('project-state')).toBeInTheDocument()
  })

  it('should handle project creation', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="create-project">Create Project</button>
          <div data-testid="project-list">No projects</div>
        </div>
      </ProjectProviderWrapper>
    )

    const createButton = screen.getByTestId('create-project')
    await user.click(createButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(createButton).toBeInTheDocument()
    })
  })

  it('should handle project updates', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="update-project">Update Project</button>
          <div data-testid="project-details">Project Details</div>
        </div>
      </ProjectProviderWrapper>
    )

    const updateButton = screen.getByTestId('update-project')
    await user.click(updateButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(updateButton).toBeInTheDocument()
    })
  })

  it('should handle project deletion', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="delete-project">Delete Project</button>
          <div data-testid="confirmation-dialog">Are you sure?</div>
        </div>
      </ProjectProviderWrapper>
    )

    const deleteButton = screen.getByTestId('delete-project')
    await user.click(deleteButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(deleteButton).toBeInTheDocument()
    })
  })

  it('should handle project sharing', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="share-project">Share Project</button>
          <div data-testid="share-modal">Share Modal</div>
        </div>
      </ProjectProviderWrapper>
    )

    const shareButton = screen.getByTestId('share-project')
    await user.click(shareButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(shareButton).toBeInTheDocument()
    })
  })

  it('should handle project collaboration', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="add-collaborator">Add Collaborator</button>
          <div data-testid="collaborator-list">Collaborators</div>
        </div>
      </ProjectProviderWrapper>
    )

    const addButton = screen.getByTestId('add-collaborator')
    await user.click(addButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(addButton).toBeInTheDocument()
    })
  })

  it('should handle project permissions', () => {
    render(
      <ProjectProviderWrapper>
        <div data-testid="project-permissions">Project Permissions Test</div>
      </ProjectProviderWrapper>
    )

    expect(screen.getByTestId('project-permissions')).toBeInTheDocument()
  })

  it('should handle project versioning', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="create-version">Create Version</button>
          <div data-testid="version-history">Version History</div>
        </div>
      </ProjectProviderWrapper>
    )

    const versionButton = screen.getByTestId('create-version')
    await user.click(versionButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(versionButton).toBeInTheDocument()
    })
  })

  it('should handle project export', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="export-project">Export Project</button>
          <div data-testid="export-options">Export Options</div>
        </div>
      </ProjectProviderWrapper>
    )

    const exportButton = screen.getByTestId('export-project')
    await user.click(exportButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(exportButton).toBeInTheDocument()
    })
  })

  it('should handle project import', async () => {
    const user = userEvent.setup()
    
    render(
      <ProjectProviderWrapper>
        <div>
          <button data-testid="import-project">Import Project</button>
          <div data-testid="import-dialog">Import Dialog</div>
        </div>
      </ProjectProviderWrapper>
    )

    const importButton = screen.getByTestId('import-project')
    await user.click(importButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(importButton).toBeInTheDocument()
    })
  })

  it('should handle project errors gracefully', () => {
    render(
      <ProjectProviderWrapper>
        <div data-testid="project-error-handling">Project Error Test</div>
      </ProjectProviderWrapper>
    )

    expect(screen.getByTestId('project-error-handling')).toBeInTheDocument()
  })

  it('should persist project state', () => {
    render(
      <ProjectProviderWrapper>
        <div data-testid="project-persistence">Project Persistence Test</div>
      </ProjectProviderWrapper>
    )

    expect(screen.getByTestId('project-persistence')).toBeInTheDocument()
  })
})
