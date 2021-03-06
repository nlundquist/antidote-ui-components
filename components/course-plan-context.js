import { html } from 'lit-html';
import { lessonSlug, acoreServiceRoot } from "../helpers/page-state.js";
import { component, useState } from 'haunted';
import useFetch from '../helpers/use-fetch.js';
import getComponentStyleSheetURL from '../helpers/stylesheet';

customElements.define('antidote-course-plan-context', component(function CoursePlanContext() {
  const allLessonRequest = useFetch(`${acoreServiceRoot}/exp/lesson`);
  const lessonPrereqRequest = useFetch(`${acoreServiceRoot}/exp/lesson/${lessonSlug}/prereqs`);
  const [name, setName] = useState(null);
  const [strengths, setStrengths] = useState({});

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    <antidote-all-lesson-context-provider .value=${allLessonRequest}>    
    <antidote-lesson-prereq-context-provider .value=${lessonPrereqRequest}>
    <antidote-course-plan-name-context-provider .value=${[name, setName]}>    
    <antidote-course-plan-strengths-context-provider .value=${[strengths, setStrengths]}>
      <slot></slot>
    </antidote-course-plan-strengths-context-provider>
    </antidote-course-plan-name-context-provider>
    </antidote-lesson-prereq-context-provider>
    </antidote-all-lesson-context-provider>
  `
}));
