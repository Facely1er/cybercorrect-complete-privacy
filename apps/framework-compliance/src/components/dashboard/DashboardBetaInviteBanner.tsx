import { PortalBetaInvitation } from '../portal/PortalBetaInvitation';

export interface DashboardBetaInviteBannerProps {
  userRole: string;
  onDismiss: () => void;
}

export function DashboardBetaInviteBanner({ 
  userRole, 
  onDismiss 
}: DashboardBetaInviteBannerProps) {
  return (
    <div className="mb-6">
      <PortalBetaInvitation 
        userRole={userRole}
        onDismiss={onDismiss}
        variant="banner"
        showDismiss={true}
      />
    </div>
  );
}


