import {ComponentPublicInstance} from 'vue';
import {MainAppData} from '@/client/components/App';

// Gives caller access to global client methods and data.
//
// This app's top level is probably not using a standard pattern, so some of this is
// just messy. But at least this method simplifies access.
export function vueRoot(component: ComponentPublicInstance): MainAppData & {
  showAlert(title: string, message: string, cb?: () => void): void;
  setVisibilityState(targetVar: string, isVisible: boolean): void;
  getVisibilityState(targetVar: string): boolean;
  update(path: string): void;
  updatePlayer(): void;
  updateSpectator(): void;
} {
  return component.$root as any;
}
