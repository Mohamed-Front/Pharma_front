import{ae as $e,af as Le,ag as ze,ah as Se,f as m,g as b,m as e,a0 as Ve,a1 as d,ai as Ce,aj as De,_ as Pe,u as je,e as Ee,r as k,d as I,V as Re,w as Fe,a as Oe,q as be,Y as Te,i as ge,j as fe,B as $,t as s,z as V,v as P,l as z,G,y as w,x as Y,F as Ne,k as Ue,C as Be,A as Ie}from"./index-b2b8894e.js";import{x as He,O as Ae}from"./index.es-81c778bd.js";var Me=`
/*!
 * Quill Editor v1.3.3
 * https://quilljs.com/
 * Copyright (c) 2014, Jason Chen
 * Copyright (c) 2013, salesforce.com
 */
.ql-container {
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 13px;
    height: 100%;
    margin: 0px;
    position: relative;
}
.ql-container.ql-disabled .ql-tooltip {
    visibility: hidden;
}
.ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
    pointer-events: none;
}
.ql-clipboard {
    left: -100000px;
    height: 1px;
    overflow-y: hidden;
    position: absolute;
    top: 50%;
}
.ql-clipboard p {
    margin: 0;
    padding: 0;
}
.ql-editor {
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.ql-editor > * {
    cursor: text;
}
.ql-editor p,
.ql-editor ol,
.ql-editor ul,
.ql-editor pre,
.ql-editor blockquote,
.ql-editor h1,
.ql-editor h2,
.ql-editor h3,
.ql-editor h4,
.ql-editor h5,
.ql-editor h6 {
    margin: 0;
    padding: 0;
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol,
.ql-editor ul {
    padding-left: 1.5rem;
}
.ql-editor ol > li,
.ql-editor ul > li {
    list-style-type: none;
}
.ql-editor ul > li::before {
    content: '\\2022';
}
.ql-editor ul[data-checked='true'],
.ql-editor ul[data-checked='false'] {
    pointer-events: none;
}
.ql-editor ul[data-checked='true'] > li *,
.ql-editor ul[data-checked='false'] > li * {
    pointer-events: all;
}
.ql-editor ul[data-checked='true'] > li::before,
.ql-editor ul[data-checked='false'] > li::before {
    color: #777;
    cursor: pointer;
    pointer-events: all;
}
.ql-editor ul[data-checked='true'] > li::before {
    content: '\\2611';
}
.ql-editor ul[data-checked='false'] > li::before {
    content: '\\2610';
}
.ql-editor li::before {
    display: inline-block;
    white-space: nowrap;
    width: 1.2rem;
}
.ql-editor li:not(.ql-direction-rtl)::before {
    margin-left: -1.5rem;
    margin-right: 0.3rem;
    text-align: right;
}
.ql-editor li.ql-direction-rtl::before {
    margin-left: 0.3rem;
    margin-right: -1.5rem;
}
.ql-editor ol li:not(.ql-direction-rtl),
.ql-editor ul li:not(.ql-direction-rtl) {
    padding-left: 1.5rem;
}
.ql-editor ol li.ql-direction-rtl,
.ql-editor ul li.ql-direction-rtl {
    padding-right: 1.5rem;
}
.ql-editor ol li {
    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    counter-increment: list-0;
}
.ql-editor ol li:before {
    content: counter(list-0, decimal) '. ';
}
.ql-editor ol li.ql-indent-1 {
    counter-increment: list-1;
}
.ql-editor ol li.ql-indent-1:before {
    content: counter(list-1, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-1 {
    counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-2 {
    counter-increment: list-2;
}
.ql-editor ol li.ql-indent-2:before {
    content: counter(list-2, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-2 {
    counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-3 {
    counter-increment: list-3;
}
.ql-editor ol li.ql-indent-3:before {
    content: counter(list-3, decimal) '. ';
}
.ql-editor ol li.ql-indent-3 {
    counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-4 {
    counter-increment: list-4;
}
.ql-editor ol li.ql-indent-4:before {
    content: counter(list-4, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-4 {
    counter-reset: list-5 list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-5 {
    counter-increment: list-5;
}
.ql-editor ol li.ql-indent-5:before {
    content: counter(list-5, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-5 {
    counter-reset: list-6 list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-6 {
    counter-increment: list-6;
}
.ql-editor ol li.ql-indent-6:before {
    content: counter(list-6, decimal) '. ';
}
.ql-editor ol li.ql-indent-6 {
    counter-reset: list-7 list-8 list-9;
}
.ql-editor ol li.ql-indent-7 {
    counter-increment: list-7;
}
.ql-editor ol li.ql-indent-7:before {
    content: counter(list-7, lower-alpha) '. ';
}
.ql-editor ol li.ql-indent-7 {
    counter-reset: list-8 list-9;
}
.ql-editor ol li.ql-indent-8 {
    counter-increment: list-8;
}
.ql-editor ol li.ql-indent-8:before {
    content: counter(list-8, lower-roman) '. ';
}
.ql-editor ol li.ql-indent-8 {
    counter-reset: list-9;
}
.ql-editor ol li.ql-indent-9 {
    counter-increment: list-9;
}
.ql-editor ol li.ql-indent-9:before {
    content: counter(list-9, decimal) '. ';
}
.ql-editor .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3rem;
}
.ql-editor li.ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 4.5rem;
}
.ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3rem;
}
.ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 4.5rem;
}
.ql-editor .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6rem;
}
.ql-editor li.ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 7.5rem;
}
.ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6rem;
}
.ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 7.5rem;
}
.ql-editor .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9rem;
}
.ql-editor li.ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 10.5rem;
}
.ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9rem;
}
.ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 10.5rem;
}
.ql-editor .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12rem;
}
.ql-editor li.ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 13.5rem;
}
.ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12rem;
}
.ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 13.5rem;
}
.ql-editor .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15rem;
}
.ql-editor li.ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 16.5rem;
}
.ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15rem;
}
.ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 16.5rem;
}
.ql-editor .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18rem;
}
.ql-editor li.ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 19.5rem;
}
.ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18rem;
}
.ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 19.5rem;
}
.ql-editor .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21rem;
}
.ql-editor li.ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 22.5rem;
}
.ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21rem;
}
.ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 22.5rem;
}
.ql-editor .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24rem;
}
.ql-editor li.ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 25.5rem;
}
.ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24rem;
}
.ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 25.5rem;
}
.ql-editor .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27rem;
}
.ql-editor li.ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 28.5rem;
}
.ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27rem;
}
.ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 28.5rem;
}
.ql-editor .ql-video {
    display: block;
    max-width: 100%;
}
.ql-editor .ql-video.ql-align-center {
    margin: 0 auto;
}
.ql-editor .ql-video.ql-align-right {
    margin: 0 0 0 auto;
}
.ql-editor .ql-bg-black {
    background-color: #000;
}
.ql-editor .ql-bg-red {
    background-color: #e60000;
}
.ql-editor .ql-bg-orange {
    background-color: #f90;
}
.ql-editor .ql-bg-yellow {
    background-color: #ff0;
}
.ql-editor .ql-bg-green {
    background-color: #008a00;
}
.ql-editor .ql-bg-blue {
    background-color: #06c;
}
.ql-editor .ql-bg-purple {
    background-color: #93f;
}
.ql-editor .ql-color-white {
    color: #fff;
}
.ql-editor .ql-color-red {
    color: #e60000;
}
.ql-editor .ql-color-orange {
    color: #f90;
}
.ql-editor .ql-color-yellow {
    color: #ff0;
}
.ql-editor .ql-color-green {
    color: #008a00;
}
.ql-editor .ql-color-blue {
    color: #06c;
}
.ql-editor .ql-color-purple {
    color: #93f;
}
.ql-editor .ql-font-serif {
    font-family: Georgia, Times New Roman, serif;
}
.ql-editor .ql-font-monospace {
    font-family: Monaco, Courier New, monospace;
}
.ql-editor .ql-size-small {
    font-size: 0.75rem;
}
.ql-editor .ql-size-large {
    font-size: 1.5rem;
}
.ql-editor .ql-size-huge {
    font-size: 2.5rem;
}
.ql-editor .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
}
.ql-editor .ql-align-center {
    text-align: center;
}
.ql-editor .ql-align-justify {
    text-align: justify;
}
.ql-editor .ql-align-right {
    text-align: right;
}
.ql-editor.ql-blank::before {
    color: rgba(0, 0, 0, 0.6);
    content: attr(data-placeholder);
    font-style: italic;
    left: 15px;
    pointer-events: none;
    position: absolute;
    right: 15px;
}
.ql-snow.ql-toolbar:after,
.ql-snow .ql-toolbar:after {
    clear: both;
    content: '';
    display: table;
}
.ql-snow.ql-toolbar button,
.ql-snow .ql-toolbar button {
    background: none;
    border: none;
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 24px;
    padding: 3px 5px;
    width: 28px;
}
.ql-snow.ql-toolbar button svg,
.ql-snow .ql-toolbar button svg {
    float: left;
    height: 100%;
}
.ql-snow.ql-toolbar button:active:hover,
.ql-snow .ql-toolbar button:active:hover {
    outline: none;
}
.ql-snow.ql-toolbar input.ql-image[type='file'],
.ql-snow .ql-toolbar input.ql-image[type='file'] {
    display: none;
}
.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button:focus,
.ql-snow .ql-toolbar button:focus,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: #06c;
}
.ql-snow.ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow.ql-toolbar button:focus .ql-fill,
.ql-snow .ql-toolbar button:focus .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #06c;
}
.ql-snow.ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow.ql-toolbar button:focus .ql-stroke,
.ql-snow .ql-toolbar button:focus .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow.ql-toolbar button:hover .ql-stroke-miter,
.ql-snow .ql-toolbar button:hover .ql-stroke-miter,
.ql-snow.ql-toolbar button:focus .ql-stroke-miter,
.ql-snow .ql-toolbar button:focus .ql-stroke-miter,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #06c;
}
@media (pointer: coarse) {
    .ql-snow.ql-toolbar button:hover:not(.ql-active),
    .ql-snow .ql-toolbar button:hover:not(.ql-active) {
        color: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
    .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
        stroke: #444;
    }
}
.ql-snow {
    box-sizing: border-box;
}
.ql-snow * {
    box-sizing: border-box;
}
.ql-snow .ql-hidden {
    display: none;
}
.ql-snow .ql-out-bottom,
.ql-snow .ql-out-top {
    visibility: hidden;
}
.ql-snow .ql-tooltip {
    position: absolute;
    transform: translateY(10px);
}
.ql-snow .ql-tooltip a {
    cursor: pointer;
    text-decoration: none;
}
.ql-snow .ql-tooltip.ql-flip {
    transform: translateY(-10px);
}
.ql-snow .ql-formats {
    display: inline-block;
    vertical-align: middle;
}
.ql-snow .ql-formats:after {
    clear: both;
    content: '';
    display: table;
}
.ql-snow .ql-stroke {
    fill: none;
    stroke: #444;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2;
}
.ql-snow .ql-stroke-miter {
    fill: none;
    stroke: #444;
    stroke-miterlimit: 10;
    stroke-width: 2;
}
.ql-snow .ql-fill,
.ql-snow .ql-stroke.ql-fill {
    fill: #444;
}
.ql-snow .ql-empty {
    fill: none;
}
.ql-snow .ql-even {
    fill-rule: evenodd;
}
.ql-snow .ql-thin,
.ql-snow .ql-stroke.ql-thin {
    stroke-width: 1;
}
.ql-snow .ql-transparent {
    opacity: 0.4;
}
.ql-snow .ql-direction svg:last-child {
    display: none;
}
.ql-snow .ql-direction.ql-active svg:last-child {
    display: inline;
}
.ql-snow .ql-direction.ql-active svg:first-child {
    display: none;
}
.ql-snow .ql-editor h1 {
    font-size: 2rem;
}
.ql-snow .ql-editor h2 {
    font-size: 1.5rem;
}
.ql-snow .ql-editor h3 {
    font-size: 1.17rem;
}
.ql-snow .ql-editor h4 {
    font-size: 1rem;
}
.ql-snow .ql-editor h5 {
    font-size: 0.83rem;
}
.ql-snow .ql-editor h6 {
    font-size: 0.67rem;
}
.ql-snow .ql-editor a {
    text-decoration: underline;
}
.ql-snow .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 16px;
}
.ql-snow .ql-editor code,
.ql-snow .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
}
.ql-snow .ql-editor pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
}
.ql-snow .ql-editor code {
    font-size: 85%;
    padding: 2px 4px;
}
.ql-snow .ql-editor pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
}
.ql-snow .ql-editor img {
    max-width: 100%;
}
.ql-snow .ql-picker {
    color: #444;
    display: inline-block;
    float: left;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    position: relative;
    vertical-align: middle;
}
.ql-snow .ql-picker-label {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    padding-left: 8px;
    padding-right: 2px;
    position: relative;
    width: 100%;
}
.ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
}
.ql-snow .ql-picker-options {
    background-color: #fff;
    display: none;
    min-width: 100%;
    padding: 4px 8px;
    position: absolute;
    white-space: nowrap;
}
.ql-snow .ql-picker-options .ql-picker-item {
    cursor: pointer;
    display: block;
    padding-bottom: 5px;
    padding-top: 5px;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label {
    color: #ccc;
    z-index: 2;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
    fill: #ccc;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
    stroke: #ccc;
}
.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    display: block;
    margin-top: -1px;
    top: 100%;
    z-index: 1;
}
.ql-snow .ql-color-picker,
.ql-snow .ql-icon-picker {
    width: 28px;
}
.ql-snow .ql-color-picker .ql-picker-label,
.ql-snow .ql-icon-picker .ql-picker-label {
    padding: 2px 4px;
}
.ql-snow .ql-color-picker .ql-picker-label svg,
.ql-snow .ql-icon-picker .ql-picker-label svg {
    right: 4px;
}
.ql-snow .ql-icon-picker .ql-picker-options {
    padding: 4px 0px;
}
.ql-snow .ql-icon-picker .ql-picker-item {
    height: 24px;
    width: 24px;
    padding: 2px 4px;
}
.ql-snow .ql-color-picker .ql-picker-options {
    padding: 3px 5px;
    width: 152px;
}
.ql-snow .ql-color-picker .ql-picker-item {
    border: 1px solid transparent;
    float: left;
    height: 16px;
    margin: 2px;
    padding: 0px;
    width: 16px;
}
.ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    position: absolute;
    margin-top: -9px;
    right: 0;
    top: 50%;
    width: 18px;
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
    content: attr(data-label);
}
.ql-snow .ql-picker.ql-header {
    width: 98px;
}
.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: 'Normal';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    content: 'Heading 1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    content: 'Heading 2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    content: 'Heading 3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    content: 'Heading 4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    content: 'Heading 5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    content: 'Heading 6';
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
    font-size: 2rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
    font-size: 1.5rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
    font-size: 1.17rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
    font-size: 1rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
    font-size: 0.83rem;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
    font-size: 0.67rem;
}
.ql-snow .ql-picker.ql-font {
    width: 108px;
}
.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: 'Sans Serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
    content: 'Serif';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
    content: 'Monospace';
}
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
    font-family: Georgia, Times New Roman, serif;
}
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
    font-family: Monaco, Courier New, monospace;
}
.ql-snow .ql-picker.ql-size {
    width: 98px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: 'Normal';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
    content: 'Small';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
    content: 'Large';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
    content: 'Huge';
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
    font-size: 10px;
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
    font-size: 18px;
}
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
    font-size: 32px;
}
.ql-snow .ql-color-picker.ql-background .ql-picker-item {
    background-color: #fff;
}
.ql-snow .ql-color-picker.ql-color .ql-picker-item {
    background-color: #000;
}
.ql-toolbar.ql-snow {
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    padding: 8px;
}
.ql-toolbar.ql-snow .ql-formats {
    margin-right: 15px;
}
.ql-toolbar.ql-snow .ql-picker-label {
    border: 1px solid transparent;
}
.ql-toolbar.ql-snow .ql-picker-options {
    border: 1px solid transparent;
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
    border-color: #ccc;
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-color: #ccc;
}
.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
.ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
    border-color: #000;
}
.ql-toolbar.ql-snow + .ql-container.ql-snow {
    border-top: 0px;
}
.ql-snow .ql-tooltip {
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 5px #ddd;
    color: #444;
    padding: 5px 12px;
    white-space: nowrap;
}
.ql-snow .ql-tooltip::before {
    content: 'Visit URL:';
    line-height: 26px;
    margin-right: 8px;
}
.ql-snow .ql-tooltip input[type='text'] {
    display: none;
    border: 1px solid #ccc;
    font-size: 13px;
    height: 26px;
    margin: 0px;
    padding: 3px 5px;
    width: 170px;
}
.ql-snow .ql-tooltip a.ql-preview {
    display: inline-block;
    max-width: 200px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
}
.ql-snow .ql-tooltip a.ql-action::after {
    border-right: 1px solid #ccc;
    content: 'Edit';
    margin-left: 16px;
    padding-right: 8px;
}
.ql-snow .ql-tooltip a.ql-remove::before {
    content: 'Remove';
    margin-left: 8px;
}
.ql-snow .ql-tooltip a {
    line-height: 26px;
}
.ql-snow .ql-tooltip.ql-editing a.ql-preview,
.ql-snow .ql-tooltip.ql-editing a.ql-remove {
    display: none;
}
.ql-snow .ql-tooltip.ql-editing input[type='text'] {
    display: inline-block;
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: 'Save';
    padding-right: 0px;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
    content: 'Enter link:';
}
.ql-snow .ql-tooltip[data-mode='formula']::before {
    content: 'Enter formula:';
}
.ql-snow .ql-tooltip[data-mode='video']::before {
    content: 'Enter video:';
}
.ql-snow a {
    color: #06c;
}
.ql-container.ql-snow {
    border: 1px solid #ccc;
}
`,Qe={root:"p-editor-container",toolbar:"p-editor-toolbar",formats:"ql-formats",header:"ql-header",font:"ql-font",bold:"ql-bold",italic:"ql-italic",underline:"ql-underline",color:"ql-color",background:"ql-background",list:"ql-list",select:"ql-align",link:"ql-link",image:"ql-image",codeBlock:"ql-code-block",clean:"ql-clean",content:"p-editor-content"},Ke=$e(Me,{name:"editor",manual:!0}),Ge=Ke.load,Ye={name:"BaseEditor",extends:Se,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},css:{classes:Qe,loadStyle:Ge},provide:function(){return{$parentInstance:this}}};function T(l){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(o){return typeof o}:function(o){return o&&typeof Symbol=="function"&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},T(l)}function ve(l,o){var p=Object.keys(l);if(Object.getOwnPropertySymbols){var q=Object.getOwnPropertySymbols(l);o&&(q=q.filter(function(y){return Object.getOwnPropertyDescriptor(l,y).enumerable})),p.push.apply(p,q)}return p}function Je(l){for(var o=1;o<arguments.length;o++){var p=arguments[o]!=null?arguments[o]:{};o%2?ve(Object(p),!0).forEach(function(q){We(l,q,p[q])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(p)):ve(Object(p)).forEach(function(q){Object.defineProperty(l,q,Object.getOwnPropertyDescriptor(p,q))})}return l}function We(l,o,p){return o=Xe(o),o in l?Object.defineProperty(l,o,{value:p,enumerable:!0,configurable:!0,writable:!0}):l[o]=p,l}function Xe(l){var o=Ze(l,"string");return T(o)==="symbol"?o:String(o)}function Ze(l,o){if(T(l)!=="object"||l===null)return l;var p=l[Symbol.toPrimitive];if(p!==void 0){var q=p.call(l,o||"default");if(T(q)!=="object")return q;throw new TypeError("@@toPrimitive must return a primitive value.")}return(o==="string"?String:Number)(l)}var he=function(){try{return window.Quill}catch{return null}}(),J={name:"Editor",extends:Ye,emits:["update:modelValue","text-change","selection-change","load"],data:function(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function(o,p){o!==p&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(o))}},mounted:function(){var o=this,p={modules:Je({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};he?(this.quill=new he(this.$refs.editorElement,p),this.initQuill(),this.handleLoad()):Le(()=>import("./quill-d77ee53a.js").then(q=>q.q),["assets/quill-d77ee53a.js","assets/index-b2b8894e.js","assets/index-3603a481.css"]).then(function(q){q&&ze.isExist(o.$refs.editorElement)&&(q.default?o.quill=new q.default(o.$refs.editorElement,p):o.quill=new q(o.$refs.editorElement,p),o.initQuill())}).then(function(){o.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(o){this.quill&&(o?this.quill.setContents(this.quill.clipboard.convert(o)):this.quill.setText(""))},initQuill:function(){var o=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(p,q,y){if(y==="user"){var S=o.$refs.editorElement.children[0].innerHTML,x=o.quill.getText().trim();S==="<p><br></p>"&&(S=""),o.$emit("update:modelValue",S),o.$emit("text-change",{htmlValue:S,textValue:x,delta:p,source:y,instance:o.quill})}}),this.quill.on("selection-change",function(p,q,y){var S=o.$refs.editorElement.children[0].innerHTML,x=o.quill.getText().trim();o.$emit("selection-change",{htmlValue:S,textValue:x,range:p,oldRange:q,source:y,instance:o.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})}}};function el(l,o,p,q,y,S){return m(),b("div",d({class:l.cx("root")},l.ptm("root"),{"data-pc-name":"editor"}),[e("div",d({ref:"toolbarElement",class:l.cx("toolbar")},l.ptm("toolbar")),[Ve(l.$slots,"toolbar",{},function(){return[e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("select",d({class:l.cx("header"),defaultValue:"0"},l.ptm("header")),[e("option",d({value:"1"},l.ptm("option")),"Heading",16),e("option",d({value:"2"},l.ptm("option")),"Subheading",16),e("option",d({value:"0"},l.ptm("option")),"Normal",16)],16),e("select",d({class:l.cx("font")},l.ptm("font")),[e("option",Ce(De(l.ptm("option"))),null,16),e("option",d({value:"serif"},l.ptm("option")),null,16),e("option",d({value:"monospace"},l.ptm("option")),null,16)],16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("bold"),type:"button"},l.ptm("bold")),null,16),e("button",d({class:l.cx("italic"),type:"button"},l.ptm("italic")),null,16),e("button",d({class:l.cx("underline"),type:"button"},l.ptm("underline")),null,16)],16),(m(),b("span",d({key:y.reRenderColorKey,class:l.cx("formats")},l.ptm("formats")),[e("select",d({class:l.cx("color")},l.ptm("color")),null,16),e("select",d({class:l.cx("background")},l.ptm("background")),null,16)],16)),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("list"),value:"ordered",type:"button"},l.ptm("list")),null,16),e("button",d({class:l.cx("list"),value:"bullet",type:"button"},l.ptm("list")),null,16),e("select",d({class:l.cx("select")},l.ptm("select")),[e("option",d({defaultValue:""},l.ptm("option")),null,16),e("option",d({value:"center"},l.ptm("option")),null,16),e("option",d({value:"right"},l.ptm("option")),null,16),e("option",d({value:"justify"},l.ptm("option")),null,16)],16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("link"),type:"button"},l.ptm("link")),null,16),e("button",d({class:l.cx("image"),type:"button"},l.ptm("image")),null,16),e("button",d({class:l.cx("codeBlock"),type:"button"},l.ptm("codeBlock")),null,16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("clean"),type:"button"},l.ptm("clean")),null,16)],16)]})],16),e("div",d({ref:"editorElement",class:l.cx("content"),style:l.editorStyle},l.ptm("content")),null,16)],16)}J.render=el;const ll={class:"flex justify-center"},nl={class:"pb-4 text-center va-text-bold"},tl={class:"mb-4"},ol={for:"email",class:"block text-sm font-medium text-gray-700"},il={key:0,class:"mt-1 text-red-500 text-sm"},rl={class:"mb-4"},al={for:"phone",class:"block text-sm font-medium text-gray-700"},sl={key:0,class:"mt-1 text-red-500 text-sm"},dl={class:"mb-4"},ql={for:"location",class:"block text-sm font-medium text-gray-700"},cl={key:0,class:"mt-1 text-red-500 text-sm"},pl={class:"mb-4"},ul={class:"block text-sm font-medium text-gray-700 mb-2"},ml={class:"mt-2 text-sm text-gray-600"},bl={key:0,class:"mt-1 text-red-500 text-sm"},gl={key:0},fl={key:1},vl={class:"mb-4"},hl={class:"block text-sm font-medium text-gray-700"},kl={key:0,class:"mt-1 text-red-500 text-sm"},wl={class:"mb-4"},yl={class:"block text-sm font-medium text-gray-700"},xl={key:0,class:"mt-1 text-red-500 text-sm"},_l={class:"mb-4"},$l={class:"block text-sm font-medium text-gray-700"},Ll={class:"flex justify-center mt-2"},zl={key:0,class:"p-4"},Sl={class:"relative group"},Vl=["src"],Cl={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},Dl={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},Pl={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},jl={class:"mt-2 text-center text-sm text-gray-500"},El={key:1,class:"p-8 flex flex-col items-center justify-center"},Rl={class:"text-sm text-center text-gray-600 mb-1"},Fl={class:"text-blue-500 font-medium"},Ol={class:"text-xs text-gray-400"},Tl={key:0,class:"mt-1 text-red-500 text-sm"},Nl={class:"mb-4"},Ul={class:"block text-sm font-medium text-gray-700"},Bl={class:"flex justify-center mt-2"},Il={key:0,class:"p-4"},Hl={class:"relative group"},Al=["src"],Ml={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},Ql={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},Kl={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},Gl={class:"mt-2 text-center text-sm text-gray-500"},Yl={key:1,class:"p-8 flex flex-col items-center justify-center"},Jl={class:"text-sm text-center text-gray-600 mb-1"},Wl={class:"text-blue-500 font-medium"},Xl={class:"text-xs text-gray-400"},Zl={key:0,class:"mt-1 text-red-500 text-sm"},en={class:"mb-4"},ln={class:"block text-sm font-medium text-gray-700"},nn={class:"flex justify-center mt-2"},tn={key:0,class:"flex flex-col items-center justify-center py-8"},on={class:"text-sm text-center text-gray-600 mb-1"},rn={class:"text-blue-500 font-medium"},an={class:"text-xs text-gray-400"},sn={key:1,class:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"},dn=["src"],qn={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-lg"},cn={class:"opacity-0 group-hover:opacity-100 space-x-2 transition-all duration-300"},pn=["onClick"],un={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},mn=["onChange"],bn={class:"flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition h-32"},gn={class:"text-xs text-gray-500"},fn={key:0,class:"mt-1 text-red-500 text-sm"},vn={__name:"update",setup(l){const{t:o,locale:p}=je(),q=Ee(),y={}.VITE_API_URL||"https://backend.pharmabank.sy",x=k((()=>localStorage.getItem("appLang")||"en")());p.value=x.value;const i=k({id:null,email:"",phone:"",location:"",lat:"",long:"",privacy_policy_en:"",privacy_policy_ar:"",terms_and_conditions_en:"",terms_and_conditions_ar:"",media:[]}),W=I({get:()=>x.value==="ar"?i.value.privacy_policy_ar||"":i.value.privacy_policy_en||"",set:t=>{x.value==="ar"?i.value.privacy_policy_ar=t:i.value.privacy_policy_en=t}}),X=I({get:()=>x.value==="ar"?i.value.terms_and_conditions_ar||"":i.value.terms_and_conditions_en||"",set:t=>{x.value==="ar"?i.value.terms_and_conditions_ar=t:i.value.terms_and_conditions_en=t}}),r=Re({email:"",phone:"",location:"",lat:"",long:"",mainLogo:"",footerLogo:"",banners:""}),f=k({}),N=k(null),U=k(null),j=k(null),E=k(null),R=k(!1),F=k(!1),O=k(!1),C=k(!1),L=k([]);Fe(x,t=>{p.value=t,localStorage.setItem("appLang",t)});const ke=I(()=>({lat:i.value.lat?parseFloat(i.value.lat):33.5138,lng:i.value.long?parseFloat(i.value.long):36.2765})),Z=I(()=>i.value.email.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.email)&&i.value.phone.trim()&&i.value.phone.length<=15&&i.value.location.trim()&&!r.email&&!r.phone&&!r.location&&!r.lat&&!r.long&&!r.mainLogo&&!r.footerLogo&&!r.banners),ee=()=>{i.value.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.email)?r.email="":r.email=o("validation.invalidEmail"):r.email=o("validation.emailRequired")},le=()=>{i.value.phone.trim()?i.value.phone.length>15?r.phone=o("validation.phoneTooLong"):r.phone="":r.phone=o("validation.phoneRequired")},B=()=>{ee(),le(),r.location=i.value.location.trim()?"":o("validation.locationRequired"),r.lat=i.value.lat&&!isNaN(parseFloat(i.value.lat))&&parseFloat(i.value.lat)>=-90&&parseFloat(i.value.lat)<=90?"":o("validation.invalidLat"),r.long=i.value.long&&!isNaN(parseFloat(i.value.long))&&parseFloat(i.value.long)>=-180&&parseFloat(i.value.long)<=180?"":o("validation.invalidLong"),r.banners=L.value.length>0?"":o("validation.atLeastOneBanner")},we=t=>{if(!t.latLng){q.add({severity:"error",summary:o("error"),detail:o("error.mapClick"),life:3e3});return}const n=t.latLng.lat(),c=t.latLng.lng();i.value.lat=n.toString(),i.value.long=c.toString(),B()},H=t=>n=>{n.preventDefault(),t==="main"?R.value=!0:t==="footer"?F.value=!0:t==="banners"&&(O.value=!0)},A=t=>()=>{t==="main"?R.value=!1:t==="footer"?F.value=!1:t==="banners"&&(O.value=!1)},M=(t,n)=>{if(!t.type.match("image.*")){const c=n==="main"?"mainLogo":n==="footer"?"footerLogo":"banners";return r[c]=o("settings.invalidImageType"),q.add({severity:"error",summary:o("error"),detail:o("settings.invalidImageType"),life:3e3}),!1}if(t.size>2*1024*1024){const c=n==="main"?"mainLogo":n==="footer"?"footerLogo":"banners";return r[c]=o("settings.imageTooLarge"),q.add({severity:"error",summary:o("error"),detail:o("settings.imageTooLarge"),life:3e3}),!1}return!0},D=(t,n)=>{var u,v,g;const c=((u=t.target.files)==null?void 0:u[0])||((g=(v=t.dataTransfer)==null?void 0:v.files)==null?void 0:g[0]);if(c&&M(c,n)){if(n==="main"){N.value=c;const _=new FileReader;_.onload=h=>j.value=h.target.result,_.readAsDataURL(c),R.value=!1,r.mainLogo=""}else if(n==="footer"){U.value=c;const _=new FileReader;_.onload=h=>E.value=h.target.result,_.readAsDataURL(c),F.value=!1,r.footerLogo=""}}},ne=t=>{t==="main"?(N.value=null,j.value=null,r.mainLogo=""):t==="footer"&&(U.value=null,E.value=null,r.footerLogo="")},Q=t=>{var c;const n=t.target.files||((c=t.dataTransfer)==null?void 0:c.files);n!=null&&n.length&&(Array.from(n).forEach(u=>{if(M(u,"banners")){const v=new FileReader;v.onload=g=>{L.value.push({file:u,preview:g.target.result})},v.readAsDataURL(u)}}),O.value=!1,r.banners="")},ye=t=>{L.value.splice(t,1),B()},xe=(t,n)=>{var u;const c=(u=t.target.files)==null?void 0:u[0];if(c&&M(c,"banners")){const v=new FileReader;v.onload=g=>{L.value[n]={file:c,preview:g.target.result}},v.readAsDataURL(c)}},_e=async()=>{var n,c,u,v;if(C.value)return;if(C.value=!0,B(),!Z.value){q.add({severity:"error",summary:o("validation.error"),detail:o("validation.fillRequired"),life:3e3}),C.value=!1;return}const t=new FormData;N.value&&t.append("main_logo",N.value),U.value&&t.append("footer_logo",U.value),L.value.forEach(g=>{t.append("banners[]",g.file)}),t.append("email",i.value.email),t.append("phone",i.value.phone),t.append("location",i.value.location),t.append("lat",i.value.lat),t.append("long",i.value.long),t.append("privacy_policy_en",i.value.privacy_policy_en),t.append("privacy_policy_ar",i.value.privacy_policy_ar),t.append("terms_and_conditions_en",i.value.terms_and_conditions_en),t.append("terms_and_conditions_ar",i.value.terms_and_conditions_ar);try{const g=await be.post(`${y}/api/setting`,t,{headers:{"Content-Type":"multipart/form-data"}});q.add({severity:"success",summary:o("success"),detail:o("settings.updated"),life:3e3})}catch(g){f.value=((c=(n=g.response)==null?void 0:n.data)==null?void 0:c.errors)||{},q.add({severity:"error",summary:o("error"),detail:((v=(u=g.response)==null?void 0:u.data)==null?void 0:v.message)||o("error.updateSettings"),life:3e3}),console.error(g)}finally{C.value=!1}};return Oe(async()=>{var t,n;try{const{data:c}=await be.get(`${y}/api/setting`),u=c.data;i.value={id:u.id,email:u.email??"",phone:u.phone??"",location:u.location??"",lat:u.lat??"",long:u.long??"",privacy_policy_en:u.privacy_policy_en??"",privacy_policy_ar:u.privacy_policy_ar??"",terms_and_conditions_en:u.terms_and_conditions_en??"",terms_and_conditions_ar:u.terms_and_conditions_ar??"",media:u.media??[]};const v=i.value.media.find(h=>h.name==="main_logo");v&&(j.value=v.url);const g=i.value.media.find(h=>h.name==="footer_logo");g&&(E.value=g.url);const _=i.value.media.filter(h=>h.name==="banner");L.value=_.map(h=>({file:null,preview:h.url})),B()}catch(c){q.add({severity:"error",summary:o("error"),detail:((n=(t=c.response)==null?void 0:t.data)==null?void 0:n.message)||o("error.loadSettings"),life:3e3}),console.error(c)}}),(t,n)=>{const c=Te("va-card");return m(),ge(c,{class:"card"},{default:fe(()=>{var u,v,g,_,h,te,oe,ie,re,ae,se,de,qe,ce,pe,ue;return[e("div",ll,[e("form",{onSubmit:$(_e,["prevent"]),class:"flex flex-col w-3/4 py-9"},[e("h2",nl,s(t.$t("settings.updateSettings")),1),e("div",tl,[e("label",ol,s(t.$t("settings.email")),1),V(z(G),{id:"email",modelValue:i.value.email,"onUpdate:modelValue":n[0]||(n[0]=a=>i.value.email=a),type:"email",required:"","aria-required":"true",class:P(["mt-2 w-full border rounded p-2",{"border-red-500":r.email}]),onInput:ee},null,8,["modelValue","class"]),r.email||(u=f.value)!=null&&u.email?(m(),b("div",il,s(r.email||((v=f.value.email)==null?void 0:v[0])),1)):w("",!0)]),e("div",rl,[e("label",al,s(t.$t("settings.phone")),1),V(z(G),{id:"phone",modelValue:i.value.phone,"onUpdate:modelValue":n[1]||(n[1]=a=>i.value.phone=a),type:"text",required:"","aria-required":"true",class:P(["mt-2 w-full border rounded p-2",{"border-red-500":r.phone}]),onInput:le},null,8,["modelValue","class"]),r.phone||(g=f.value)!=null&&g.phone?(m(),b("div",sl,s(r.phone||((_=f.value.phone)==null?void 0:_[0])),1)):w("",!0)]),e("div",dl,[e("label",ql,s(t.$t("settings.location")),1),V(z(G),{id:"location",modelValue:i.value.location,"onUpdate:modelValue":n[2]||(n[2]=a=>i.value.location=a),type:"text",required:"","aria-required":"true",class:P(["mt-2 w-full border rounded p-2",{"border-red-500":r.location}])},null,8,["modelValue","class"]),r.location||(h=f.value)!=null&&h.location?(m(),b("div",cl,s(r.location||((te=f.value.location)==null?void 0:te[0])),1)):w("",!0)]),e("div",pl,[e("label",ul,s(t.$t("settings.mapLocation")),1),V(z(Ae),{style:{width:"100%",height:"400px","border-radius":"8px"},center:ke.value,zoom:10,onClick:we,class:"rounded border shadow-md"},{default:fe(()=>[i.value.lat&&i.value.long?(m(),ge(z(He),{key:0,options:{position:{lat:parseFloat(i.value.lat),lng:parseFloat(i.value.long)}}},null,8,["options"])):w("",!0)]),_:1},8,["center"]),e("div",ml,s(t.$t("settings.currentCoords"))+": "+s(i.value.lat||"Not set")+", "+s(i.value.long||"Not set"),1),r.lat||r.long||(oe=f.value)!=null&&oe.lat||(ie=f.value)!=null&&ie.long?(m(),b("div",bl,[r.lat||(re=f.value)!=null&&re.lat?(m(),b("span",gl,s(r.lat||((ae=f.value.lat)==null?void 0:ae[0])),1)):w("",!0),r.long||(se=f.value)!=null&&se.long?(m(),b("span",fl,s(r.long||((de=f.value.long)==null?void 0:de[0])),1)):w("",!0)])):w("",!0)]),e("div",vl,[e("label",hl,s(t.$t("settings.privacyPolicy")),1),V(z(J),{id:"privacy_policy",modelValue:W.value,"onUpdate:modelValue":n[3]||(n[3]=a=>W.value=a),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(qe=f.value)!=null&&qe.privacy_policy?(m(),b("div",kl,s((ce=f.value.privacy_policy)==null?void 0:ce[0]),1)):w("",!0)]),e("div",wl,[e("label",yl,s(t.$t("settings.termsConditions")),1),V(z(J),{id:"terms_and_conditions",modelValue:X.value,"onUpdate:modelValue":n[4]||(n[4]=a=>X.value=a),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(pe=f.value)!=null&&pe.terms_and_conditions?(m(),b("div",xl,s((ue=f.value.terms_and_conditions)==null?void 0:ue[0]),1)):w("",!0)]),e("div",_l,[e("label",$l,s(t.$t("settings.mainLogo")),1),e("div",Ll,[e("label",{onDragover:n[8]||(n[8]=$(a=>H("main"),["prevent"])),onDragleave:n[9]||(n[9]=a=>A("main")),onDrop:n[10]||(n[10]=$(a=>D(a,"main"),["prevent"])),class:P([{"border-blue-500 bg-blue-50":R.value,"border-gray-300":!R.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:n[5]||(n[5]=a=>D(a,"main")),accept:"image/*",class:"hidden","aria-label":"Upload main logo",id:"main-logo-upload"},null,32),j.value?(m(),b("div",zl,[e("div",Sl,[e("img",{src:j.value,alt:"Main Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,Vl),e("div",Cl,[e("div",Dl,[e("button",{type:"button",onClick:n[6]||(n[6]=$(a=>ne("main"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[22]||(n[22]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",Pl,[n[23]||(n[23]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:n[7]||(n[7]=a=>D(a,"main")),accept:"image/*",class:"hidden","aria-label":"Replace main logo"},null,32)])])])]),e("p",jl,s(t.$t("settings.changeLogo")),1)])):(m(),b("div",El,[n[24]||(n[24]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",Rl,[e("span",Fl,s(t.$t("settings.upload")),1),Y(" "+s(t.$t("settings.orDragDrop")),1)]),e("p",Ol,s(t.$t("settings.fileTypes")),1)]))],34)]),r.mainLogo?(m(),b("div",Tl,s(r.mainLogo),1)):w("",!0)]),e("div",Nl,[e("label",Ul,s(t.$t("settings.footerLogo")),1),e("div",Bl,[e("label",{onDragover:n[14]||(n[14]=$(a=>H("footer"),["prevent"])),onDragleave:n[15]||(n[15]=a=>A("footer")),onDrop:n[16]||(n[16]=$(a=>D(a,"footer"),["prevent"])),class:P([{"border-blue-500 bg-blue-50":F.value,"border-gray-300":!F.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:n[11]||(n[11]=a=>D(a,"footer")),accept:"image/*",class:"hidden","aria-label":"Upload footer logo",id:"footer-logo-upload"},null,32),E.value?(m(),b("div",Il,[e("div",Hl,[e("img",{src:E.value,alt:"Footer Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,Al),e("div",Ml,[e("div",Ql,[e("button",{type:"button",onClick:n[12]||(n[12]=$(a=>ne("footer"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[25]||(n[25]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",Kl,[n[26]||(n[26]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:n[13]||(n[13]=a=>D(a,"footer")),accept:"image/*",class:"hidden","aria-label":"Replace footer logo"},null,32)])])])]),e("p",Gl,s(t.$t("settings.changeLogo")),1)])):(m(),b("div",Yl,[n[27]||(n[27]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",Jl,[e("span",Wl,s(t.$t("settings.upload")),1),Y(" "+s(t.$t("settings.orDragDrop")),1)]),e("p",Xl,s(t.$t("settings.fileTypes")),1)]))],34)]),r.footerLogo?(m(),b("div",Zl,s(r.footerLogo),1)):w("",!0)]),e("div",en,[e("label",ln,s(t.$t("settings.banners"))+" ("+s(L.value.length)+") ",1),e("div",nn,[e("label",{onDragover:n[19]||(n[19]=$(a=>H("banners"),["prevent"])),onDragleave:n[20]||(n[20]=a=>A("banners")),onDrop:n[21]||(n[21]=$(a=>Q(a),["prevent"])),class:P([{"border-blue-500 bg-blue-50":O.value,"border-gray-300":!O.value},"cursor-pointer w-full max-w-4xl rounded-xl border-2 border-dashed transition duration-300 p-6"])},[e("input",{type:"file",multiple:"",onChange:n[17]||(n[17]=a=>Q(a)),accept:"image/*",class:"hidden",id:"banners-upload"},null,32),L.value.length===0?(m(),b("div",tn,[n[28]||(n[28]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-images text-blue-500 text-3xl"})],-1)),e("p",on,[e("span",rn,s(t.$t("settings.uploadBanners")),1),Y(" "+s(t.$t("settings.orDragDrop")),1)]),e("p",an,s(t.$t("settings.fileTypes")),1)])):(m(),b("div",sn,[(m(!0),b(Ne,null,Ue(L.value,(a,K)=>(m(),b("div",{key:K,class:"relative group"},[e("img",{src:a.preview,alt:"Banner Preview",class:"w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,dn),e("div",qn,[e("div",cn,[e("button",{type:"button",onClick:$(me=>ye(K),["stop"]),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[29]||(n[29]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])],8,pn),e("label",un,[n[30]||(n[30]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:me=>xe(me,K),accept:"image/*",class:"hidden"},null,40,mn)])])])]))),128)),e("label",bn,[n[31]||(n[31]=e("i",{class:"pi pi-plus text-2xl text-gray-400 mb-1"},null,-1)),e("span",gn,s(t.$t("settings.addMore")),1),e("input",{type:"file",multiple:"",onChange:n[18]||(n[18]=a=>Q(a)),accept:"image/*",class:"hidden"},null,32)])]))],34)]),r.banners?(m(),b("div",fn,s(r.banners),1)):w("",!0)]),V(z(Be),{type:"submit",label:C.value?t.$t("settings.updating"):t.$t("settings.update"),class:"mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded p-2",disabled:C.value||!Z.value},null,8,["label","disabled"])],32)]),V(z(Ie))]}),_:1})}}},wn=Pe(vn,[["__scopeId","data-v-8dddf336"]]);export{wn as default};
