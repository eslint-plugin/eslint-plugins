import { name, version } from "../package.json";
import flatConfigBase from "./configs/flat-config-base";
import legacyConfigBase from "./configs/legacy-config-base";

import accessibleEmojiRule from "./rules/accessible-emoji";
import altTextRule from "./rules/alt-text";
import anchorAmbiguousTextRule from "./rules/anchor-ambiguous-text";
import anchorHasContentRule from "./rules/anchor-has-content";
import anchorIsValidRule from "./rules/anchor-is-valid";
import ariaActivedescendantHasTabindexRule from "./rules/aria-activedescendant-has-tabindex";
import ariaPropsRule from "./rules/aria-props";
import ariaProptypesRule from "./rules/aria-proptypes";
import ariaRoleRule from "./rules/aria-role";
import ariaUnsupportedElementsRule from "./rules/aria-unsupported-elements";
import autocompleteValidRule from "./rules/autocomplete-valid";
import clickEventsHaveKeyEventsRule from "./rules/click-events-have-key-events";
import controlHasAssociatedLabelRule from "./rules/control-has-associated-label";
import headingHasContentRule from "./rules/heading-has-content";
import htmlHasLangRule from "./rules/html-has-lang";
import iframeHasTitleRule from "./rules/iframe-has-title";
import imgRedundantAltRule from "./rules/img-redundant-alt";
import interactiveSupportsFocusRule from "./rules/interactive-supports-focus";
import labelHasAssociatedControlRule from "./rules/label-has-associated-control";
import labelHasForRule from "./rules/label-has-for";
import langRule from "./rules/lang";
import mediaHasCaptionRule from "./rules/media-has-caption";
import mouseEventsHaveKeyEventsRule from "./rules/mouse-events-have-key-events";
import noAccessKeyRule from "./rules/no-access-key";
import noAriaHiddenOnFocusableRule from "./rules/no-aria-hidden-on-focusable";
import noAutofocusRule from "./rules/no-autofocus";
import noDistractingElementsRule from "./rules/no-distracting-elements";
import noInteractiveElementToNoninteractiveRoleRule from "./rules/no-interactive-element-to-noninteractive-role";
import noNoninteractiveElementInteractionsRule from "./rules/no-noninteractive-element-interactions";
import noNoninteractiveElementToInteractiveRoleRule from "./rules/no-noninteractive-element-to-interactive-role";
import noNoninteractiveTabindexRule from "./rules/no-noninteractive-tabindex";
import noOnchangeRule from "./rules/no-onchange";
import noRedundantRolesRule from "./rules/no-redundant-roles";
import noStaticElementInteractionsRule from "./rules/no-static-element-interactions";
import preferTagOverRoleRule from "./rules/prefer-tag-over-role";
import roleHasRequiredAriaPropsRule from "./rules/role-has-required-aria-props";
import roleSupportsAriaPropsRule from "./rules/role-supports-aria-props";
import scopeRule from "./rules/scope";
import tabindexNoPositiveRule from "./rules/tabindex-no-positive";

const allRules = {
  "accessible-emoji": accessibleEmojiRule,
  "alt-text": altTextRule,
  "anchor-ambiguous-text": anchorAmbiguousTextRule,
  "anchor-has-content": anchorHasContentRule,
  "anchor-is-valid": anchorIsValidRule,
  "aria-activedescendant-has-tabindex": ariaActivedescendantHasTabindexRule,
  "aria-props": ariaPropsRule,
  "aria-proptypes": ariaProptypesRule,
  "aria-role": ariaRoleRule,
  "aria-unsupported-elements": ariaUnsupportedElementsRule,
  "autocomplete-valid": autocompleteValidRule,
  "click-events-have-key-events": clickEventsHaveKeyEventsRule,
  "control-has-associated-label": controlHasAssociatedLabelRule,
  "heading-has-content": headingHasContentRule,
  "html-has-lang": htmlHasLangRule,
  "iframe-has-title": iframeHasTitleRule,
  "img-redundant-alt": imgRedundantAltRule,
  "interactive-supports-focus": interactiveSupportsFocusRule,
  "label-has-associated-control": labelHasAssociatedControlRule,
  "label-has-for": labelHasForRule,
  lang: langRule,
  "media-has-caption": mediaHasCaptionRule,
  "mouse-events-have-key-events": mouseEventsHaveKeyEventsRule,
  "no-access-key": noAccessKeyRule,
  "no-aria-hidden-on-focusable": noAriaHiddenOnFocusableRule,
  "no-autofocus": noAutofocusRule,
  "no-distracting-elements": noDistractingElementsRule,
  "no-interactive-element-to-noninteractive-role": noInteractiveElementToNoninteractiveRoleRule,
  "no-noninteractive-element-interactions": noNoninteractiveElementInteractionsRule,
  "no-noninteractive-element-to-interactive-role": noNoninteractiveElementToInteractiveRoleRule,
  "no-noninteractive-tabindex": noNoninteractiveTabindexRule,
  "no-onchange": noOnchangeRule,
  "no-redundant-roles": noRedundantRolesRule,
  "no-static-element-interactions": noStaticElementInteractionsRule,
  "prefer-tag-over-role": preferTagOverRoleRule,
  "role-has-required-aria-props": roleHasRequiredAriaPropsRule,
  "role-supports-aria-props": roleSupportsAriaPropsRule,
  scope: scopeRule,
  "tabindex-no-positive": tabindexNoPositiveRule,
};

const recommendedRules = {
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-ambiguous-text": "off", // TODO: error
  "jsx-a11y/anchor-has-content": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/aria-activedescendant-has-tabindex": "error",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-proptypes": "error",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/aria-unsupported-elements": "error",
  "jsx-a11y/autocomplete-valid": "error",
  "jsx-a11y/click-events-have-key-events": "error",
  "jsx-a11y/control-has-associated-label": [
    "off",
    {
      ignoreElements: [
        "audio",
        "canvas",
        "embed",
        "input",
        "textarea",
        "tr",
        "video",
      ],
      ignoreRoles: [
        "grid",
        "listbox",
        "menu",
        "menubar",
        "radiogroup",
        "row",
        "tablist",
        "toolbar",
        "tree",
        "treegrid",
      ],
      includeRoles: ["alert", "dialog"],
    },
  ],
  "jsx-a11y/heading-has-content": "error",
  "jsx-a11y/html-has-lang": "error",
  "jsx-a11y/iframe-has-title": "error",
  "jsx-a11y/img-redundant-alt": "error",
  "jsx-a11y/interactive-supports-focus": [
    "error",
    {
      tabbable: [
        "button",
        "checkbox",
        "link",
        "searchbox",
        "spinbutton",
        "switch",
        "textbox",
      ],
    },
  ],
  "jsx-a11y/label-has-associated-control": "error",
  "jsx-a11y/label-has-for": "off",
  "jsx-a11y/media-has-caption": "error",
  "jsx-a11y/mouse-events-have-key-events": "error",
  "jsx-a11y/no-access-key": "error",
  "jsx-a11y/no-autofocus": "error",
  "jsx-a11y/no-distracting-elements": "error",
  "jsx-a11y/no-interactive-element-to-noninteractive-role": [
    "error",
    {
      tr: ["none", "presentation"],
      canvas: ["img"],
    },
  ],
  "jsx-a11y/no-noninteractive-element-interactions": [
    "error",
    {
      handlers: [
        "onClick",
        "onError",
        "onLoad",
        "onMouseDown",
        "onMouseUp",
        "onKeyPress",
        "onKeyDown",
        "onKeyUp",
      ],
      alert: ["onKeyUp", "onKeyDown", "onKeyPress"],
      body: ["onError", "onLoad"],
      dialog: ["onKeyUp", "onKeyDown", "onKeyPress"],
      iframe: ["onError", "onLoad"],
      img: ["onError", "onLoad"],
    },
  ],
  "jsx-a11y/no-noninteractive-element-to-interactive-role": [
    "error",
    {
      ul: [
        "listbox",
        "menu",
        "menubar",
        "radiogroup",
        "tablist",
        "tree",
        "treegrid",
      ],
      ol: [
        "listbox",
        "menu",
        "menubar",
        "radiogroup",
        "tablist",
        "tree",
        "treegrid",
      ],
      li: [
        "menuitem",
        "menuitemradio",
        "menuitemcheckbox",
        "option",
        "row",
        "tab",
        "treeitem",
      ],
      table: ["grid"],
      td: ["gridcell"],
      fieldset: ["radiogroup", "presentation"],
    },
  ],
  "jsx-a11y/no-noninteractive-tabindex": [
    "error",
    {
      tags: [],
      roles: ["tabpanel"],
      allowExpressionValues: true,
    },
  ],
  "jsx-a11y/no-redundant-roles": "error",
  "jsx-a11y/no-static-element-interactions": [
    "error",
    {
      allowExpressionValues: true,
      handlers: [
        "onClick",
        "onMouseDown",
        "onMouseUp",
        "onKeyPress",
        "onKeyDown",
        "onKeyUp",
      ],
    },
  ],
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/role-supports-aria-props": "error",
  "jsx-a11y/scope": "error",
  "jsx-a11y/tabindex-no-positive": "error",
};

const strictRules = {
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-has-content": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/aria-activedescendant-has-tabindex": "error",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-proptypes": "error",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/aria-unsupported-elements": "error",
  "jsx-a11y/autocomplete-valid": "error",
  "jsx-a11y/click-events-have-key-events": "error",
  "jsx-a11y/control-has-associated-label": [
    "off",
    {
      ignoreElements: [
        "audio",
        "canvas",
        "embed",
        "input",
        "textarea",
        "tr",
        "video",
      ],
      ignoreRoles: [
        "grid",
        "listbox",
        "menu",
        "menubar",
        "radiogroup",
        "row",
        "tablist",
        "toolbar",
        "tree",
        "treegrid",
      ],
      includeRoles: ["alert", "dialog"],
    },
  ],
  "jsx-a11y/heading-has-content": "error",
  "jsx-a11y/html-has-lang": "error",
  "jsx-a11y/iframe-has-title": "error",
  "jsx-a11y/img-redundant-alt": "error",
  "jsx-a11y/interactive-supports-focus": [
    "error",
    {
      tabbable: [
        "button",
        "checkbox",
        "link",
        "progressbar",
        "searchbox",
        "slider",
        "spinbutton",
        "switch",
        "textbox",
      ],
    },
  ],
  "jsx-a11y/label-has-for": "off",
  "jsx-a11y/label-has-associated-control": "error",
  "jsx-a11y/media-has-caption": "error",
  "jsx-a11y/mouse-events-have-key-events": "error",
  "jsx-a11y/no-access-key": "error",
  "jsx-a11y/no-autofocus": "error",
  "jsx-a11y/no-distracting-elements": "error",
  "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
  "jsx-a11y/no-noninteractive-element-interactions": [
    "error",
    {
      body: ["onError", "onLoad"],
      iframe: ["onError", "onLoad"],
      img: ["onError", "onLoad"],
    },
  ],
  "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
  "jsx-a11y/no-noninteractive-tabindex": "error",
  "jsx-a11y/no-redundant-roles": "error",
  "jsx-a11y/no-static-element-interactions": "error",
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/role-supports-aria-props": "error",
  "jsx-a11y/scope": "error",
  "jsx-a11y/tabindex-no-positive": "error",
};

/** Base plugin object */
const jsxA11y = {
  meta: { name, version },
  rules: { ...allRules },
};

/**
 * Given a ruleset and optionally a flat config name, generate a config.
 * @param {object} rules - ruleset for this config
 * @param {string} [flatConfigName] - name for the config if flat
 * @returns Config for this set of rules.
 */
const createConfig = (rules, flatConfigName?: string) => ({
  ...(flatConfigName
    ? {
        ...flatConfigBase,
        name: `jsx-a11y/${flatConfigName}`,
        plugins: { "jsx-a11y": jsxA11y },
      }
    : { ...legacyConfigBase, plugins: ["jsx-a11y"] }),
  rules: { ...rules },
});

// Create configs for the plugin object
const configs = {
  recommended: createConfig(recommendedRules),
  strict: createConfig(strictRules),
};
const flatConfigs = {
  recommended: createConfig(recommendedRules, "recommended"),
  strict: createConfig(strictRules, "strict"),
};

module.exports = Object.assign(jsxA11y, { configs, flatConfigs });
