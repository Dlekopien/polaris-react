import * as React from 'react';
// eslint-disable-next-line shopify/strict-component-boundaries
import {
  withAppProvider,
  WithAppProviderProps,
} from '../../components/AppProvider';

export interface Props {
  /** Whether the alert is open or not */
  open: boolean;
  /** The content to display inside the alert */
  children?: string;
  /** The alert title */
  title?: string;
  /** For confirming a destructive or dangerous action */
  destructive?: boolean;
  /** The content of the confirmation button */
  confirmContent: string;
  /** The content of the cancel button */
  cancelContent?: string;
  /** Callback when the confirmation button is clicked */
  onClose?(): void;
  /** Callback when the alert is closed, or when the cancel button is clicked */
  onConfirm(): void;
}

export class Alert extends React.PureComponent<
  Props & WithAppProviderProps,
  never
> {
  private focusReturnPoint: HTMLElement | null = null;

  componentDidMount() {
    const {open} = this.props;
    if (open) {
      this.handleEASDKMessaging();
      this.focusReturnPoint = document.activeElement as HTMLElement;
    }
  }

  componentDidUpdate({open: wasOpen}: Props) {
    const {open} = this.props;

    if (wasOpen !== open) {
      this.handleEASDKMessaging();
    }

    if (!wasOpen && open) {
      this.focusReturnPoint = document.activeElement as HTMLElement;
    } else if (
      wasOpen &&
      !open &&
      this.focusReturnPoint != null &&
      document.contains(this.focusReturnPoint)
    ) {
      this.focusReturnPoint.focus();
      this.focusReturnPoint = null;
    }
  }

  render() {
    return null;
  }

  private handleEASDKMessaging() {
    const {open, polaris} = this.props;
    if (polaris.easdk == null) {
      return;
    }

    if (open) {
      polaris.easdk.Modal.alert(this.props);
    } else {
      polaris.easdk.Modal.close();
    }
  }
}

export default withAppProvider<Props>()(Alert);
