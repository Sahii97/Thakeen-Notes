import { Mark, mergeAttributes } from '@tiptap/core';

export interface SaltMarkOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    saltMark: {
      /**
       * Toggle a salt mark (jamaliyat / alternate styling)
       */
      toggleSalt: () => ReturnType;
    };
  }
}

export const SaltMark = Mark.create<SaltMarkOptions>({
  name: 'saltMark',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-salt]',
      },
      {
        style: 'font-feature-settings',
        getAttrs: value => (value as string).includes('"salt"') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-salt': 'true', class: 'salt-text-mark' }), 0];
  },

  addCommands() {
    return {
      toggleSalt: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
    };
  },
});
