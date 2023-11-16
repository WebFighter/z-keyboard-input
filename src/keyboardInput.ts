/**
 *监听键盘输入的类
 */
export class KeyboardInput {
  constructor(listening: boolean = false) {
    if (listening) this.startListening();
  }

  private alreadyListen = false; //已经开启监听
  private keys: Set<string> = new Set();
  private upKeys: Set<string> = new Set();
  private clearVisible = false;

  private getKeysCallback?: (keys: string[]) => void;

  /**
   * 获取keys
   */
  public getKeys(callback: (keys: string[]) => void) {
    this.getKeysCallback = callback;
    return [...this.keys];
  }

  /**
   * 移除监听
   */
  public removeListening() {
    this.alreadyListen = false;
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup);
    window.removeEventListener('blur', this.blur);
  }

  /**
   * 开始监听
   */
  public startListening() {
    if (this.alreadyListen) return;
    this.alreadyListen = true;
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
    window.addEventListener('blur', this.blur);
  }

  /**
   * 清空
   */
  public clearKeys() {
    this.keys.clear();
    this.upKeys.clear();
    this.getKeysCallback && this.getKeysCallback([...this.keys]);
  }

  private setKeys(key: string) {
    if (this.clearVisible) {
      this.keys.clear();
      this.clearVisible = false;
    }
    if (this.keys.has(key)) return;
    this.keys.add(key);
    this.getKeysCallback && this.getKeysCallback([...this.keys]);
  }

  private keydown = (e: KeyboardEvent) => {
    if (!this.isAllowKey(e.keyCode)) return;
    this.setKeys(e.key);
  };

  private keyup = (e: KeyboardEvent) => {
    if (!this.isAllowKey(e.keyCode)) return;
    this.upKeys.add(e.key);
    if (this.upKeys.size == this.keys.size) {
      this.clearVisible = true;
      this.upKeys.clear();
    }
  };

  private blur = (e: FocusEvent) => {
    this.clearVisible = true;
  };

  // 是否允许
  private isAllowKey(keycode: number) {
    // let allowKeycode = new Set<number>([17, 16, 18])
    // if (allowKeycode.has(keycode))return true;
    if (keycode == 17 || keycode == 16 || keycode == 18) return true;
    if (keycode >= 65 && keycode <= 90) return true;
    return false;
  }
}
