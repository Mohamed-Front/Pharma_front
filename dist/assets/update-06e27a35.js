import{ag as ge,ah as ve,ai as he,aj as ke,e as m,h as f,g as e,a4 as we,a5 as d,ak as ye,al as xe,_ as _e,u as $e,a as ze,r as k,m as Le,c as G,Y as Ve,o as Se,b as ce,d as De,f as Ce,w as Ee,D as _,t as s,i as L,A as D,j as V,H as F,C as $,B as J,F as je,y as Pe,E as Re,k as Te}from"./index-2cd76906.js";var Oe=`
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
`,Ue={root:"p-editor-container",toolbar:"p-editor-toolbar",formats:"ql-formats",header:"ql-header",font:"ql-font",bold:"ql-bold",italic:"ql-italic",underline:"ql-underline",color:"ql-color",background:"ql-background",list:"ql-list",select:"ql-align",link:"ql-link",image:"ql-image",codeBlock:"ql-code-block",clean:"ql-clean",content:"p-editor-content"},Be=ge(Oe,{name:"editor",manual:!0}),He=Be.load,Ie={name:"BaseEditor",extends:ke,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},css:{classes:Ue,loadStyle:He},provide:function(){return{$parentInstance:this}}};function B(l){"@babel/helpers - typeof";return B=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},B(l)}function pe(l,t){var c=Object.keys(l);if(Object.getOwnPropertySymbols){var q=Object.getOwnPropertySymbols(l);t&&(q=q.filter(function(w){return Object.getOwnPropertyDescriptor(l,w).enumerable})),c.push.apply(c,q)}return c}function Fe(l){for(var t=1;t<arguments.length;t++){var c=arguments[t]!=null?arguments[t]:{};t%2?pe(Object(c),!0).forEach(function(q){Ae(l,q,c[q])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(c)):pe(Object(c)).forEach(function(q){Object.defineProperty(l,q,Object.getOwnPropertyDescriptor(c,q))})}return l}function Ae(l,t,c){return t=Ne(t),t in l?Object.defineProperty(l,t,{value:c,enumerable:!0,configurable:!0,writable:!0}):l[t]=c,l}function Ne(l){var t=Me(l,"string");return B(t)==="symbol"?t:String(t)}function Me(l,t){if(B(l)!=="object"||l===null)return l;var c=l[Symbol.toPrimitive];if(c!==void 0){var q=c.call(l,t||"default");if(B(q)!=="object")return q;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(l)}var ue=function(){try{return window.Quill}catch{return null}}(),W={name:"Editor",extends:Ie,emits:["update:modelValue","text-change","selection-change","load"],data:function(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function(t,c){t!==c&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(t))}},mounted:function(){var t=this,c={modules:Fe({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};ue?(this.quill=new ue(this.$refs.editorElement,c),this.initQuill(),this.handleLoad()):ve(()=>import("./quill-842291e2.js").then(q=>q.q),["assets/quill-842291e2.js","assets/index-2cd76906.js","assets/index-2b4d7e6a.css"]).then(function(q){q&&he.isExist(t.$refs.editorElement)&&(q.default?t.quill=new q.default(t.$refs.editorElement,c):t.quill=new q(t.$refs.editorElement,c),t.initQuill())}).then(function(){t.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(t){this.quill&&(t?this.quill.setContents(this.quill.clipboard.convert(t)):this.quill.setText(""))},initQuill:function(){var t=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(c,q,w){if(w==="user"){var z=t.$refs.editorElement.children[0].innerHTML,y=t.quill.getText().trim();z==="<p><br></p>"&&(z=""),t.$emit("update:modelValue",z),t.$emit("text-change",{htmlValue:z,textValue:y,delta:c,source:w,instance:t.quill})}}),this.quill.on("selection-change",function(c,q,w){var z=t.$refs.editorElement.children[0].innerHTML,y=t.quill.getText().trim();t.$emit("selection-change",{htmlValue:z,textValue:y,range:c,oldRange:q,source:w,instance:t.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})}}};function Qe(l,t,c,q,w,z){return m(),f("div",d({class:l.cx("root")},l.ptm("root"),{"data-pc-name":"editor"}),[e("div",d({ref:"toolbarElement",class:l.cx("toolbar")},l.ptm("toolbar")),[we(l.$slots,"toolbar",{},function(){return[e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("select",d({class:l.cx("header"),defaultValue:"0"},l.ptm("header")),[e("option",d({value:"1"},l.ptm("option")),"Heading",16),e("option",d({value:"2"},l.ptm("option")),"Subheading",16),e("option",d({value:"0"},l.ptm("option")),"Normal",16)],16),e("select",d({class:l.cx("font")},l.ptm("font")),[e("option",ye(xe(l.ptm("option"))),null,16),e("option",d({value:"serif"},l.ptm("option")),null,16),e("option",d({value:"monospace"},l.ptm("option")),null,16)],16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("bold"),type:"button"},l.ptm("bold")),null,16),e("button",d({class:l.cx("italic"),type:"button"},l.ptm("italic")),null,16),e("button",d({class:l.cx("underline"),type:"button"},l.ptm("underline")),null,16)],16),(m(),f("span",d({key:w.reRenderColorKey,class:l.cx("formats")},l.ptm("formats")),[e("select",d({class:l.cx("color")},l.ptm("color")),null,16),e("select",d({class:l.cx("background")},l.ptm("background")),null,16)],16)),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("list"),value:"ordered",type:"button"},l.ptm("list")),null,16),e("button",d({class:l.cx("list"),value:"bullet",type:"button"},l.ptm("list")),null,16),e("select",d({class:l.cx("select")},l.ptm("select")),[e("option",d({defaultValue:""},l.ptm("option")),null,16),e("option",d({value:"center"},l.ptm("option")),null,16),e("option",d({value:"right"},l.ptm("option")),null,16),e("option",d({value:"justify"},l.ptm("option")),null,16)],16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("link"),type:"button"},l.ptm("link")),null,16),e("button",d({class:l.cx("image"),type:"button"},l.ptm("image")),null,16),e("button",d({class:l.cx("codeBlock"),type:"button"},l.ptm("codeBlock")),null,16)],16),e("span",d({class:l.cx("formats")},l.ptm("formats")),[e("button",d({class:l.cx("clean"),type:"button"},l.ptm("clean")),null,16)],16)]})],16),e("div",d({ref:"editorElement",class:l.cx("content"),style:l.editorStyle},l.ptm("content")),null,16)],16)}W.render=Qe;const Ke={class:"flex justify-center"},Ye={class:"pb-4 text-center va-text-bold"},Ge={class:"mb-4"},Je={for:"email",class:"block text-sm font-medium text-gray-700"},We={key:0,class:"mt-1 text-red-500 text-sm"},Xe={class:"mb-4"},Ze={for:"phone",class:"block text-sm font-medium text-gray-700"},el={key:0,class:"mt-1 text-red-500 text-sm"},ll={class:"mb-4"},nl={for:"location",class:"block text-sm font-medium text-gray-700"},tl={key:0,class:"mt-1 text-red-500 text-sm"},ol={class:"mb-4"},il={for:"map_link",class:"block text-sm font-medium text-gray-700"},rl={class:"mt-1 text-xs text-gray-500"},al={key:0,class:"mt-1 text-red-500 text-sm"},sl={class:"mb-4"},dl={class:"block text-sm font-medium text-gray-700"},ql={key:0,class:"mt-1 text-red-500 text-sm"},cl={class:"mb-4"},pl={class:"block text-sm font-medium text-gray-700"},ul={key:0,class:"mt-1 text-red-500 text-sm"},ml={class:"mb-4"},bl={class:"block text-sm font-medium text-gray-700"},fl={class:"flex justify-center mt-2"},gl={key:0,class:"p-4"},vl={class:"relative group"},hl=["src"],kl={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},wl={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},yl={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},xl={class:"mt-2 text-center text-sm text-gray-500"},_l={key:1,class:"p-8 flex flex-col items-center justify-center"},$l={class:"text-sm text-center text-gray-600 mb-1"},zl={class:"text-blue-500 font-medium"},Ll={class:"text-xs text-gray-400"},Vl={key:0,class:"mt-1 text-red-500 text-sm"},Sl={class:"mb-4"},Dl={class:"block text-sm font-medium text-gray-700"},Cl={class:"flex justify-center mt-2"},El={key:0,class:"p-4"},jl={class:"relative group"},Pl=["src"],Rl={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},Tl={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},Ol={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},Ul={class:"mt-2 text-center text-sm text-gray-500"},Bl={key:1,class:"p-8 flex flex-col items-center justify-center"},Hl={class:"text-sm text-center text-gray-600 mb-1"},Il={class:"text-blue-500 font-medium"},Fl={class:"text-xs text-gray-400"},Al={key:0,class:"mt-1 text-red-500 text-sm"},Nl={class:"mb-4"},Ml={class:"block text-sm font-medium text-gray-700"},Ql={class:"flex justify-center mt-2"},Kl={key:0,class:"flex flex-col items-center justify-center py-8"},Yl={class:"text-sm text-center text-gray-600 mb-1"},Gl={class:"text-blue-500 font-medium"},Jl={class:"text-xs text-gray-400"},Wl={key:1,class:"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"},Xl=["src"],Zl={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-lg"},en={class:"opacity-0 group-hover:opacity-100 space-x-2 transition-all duration-300"},ln=["onClick"],nn={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},tn=["onChange"],on={class:"flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition h-32"},rn={class:"text-xs text-gray-500"},an={key:0,class:"mt-1 text-red-500 text-sm"},sn={__name:"update",setup(l){const{t,locale:c}=$e(),q=ze(),w={}.VITE_API_URL||"https://pharma-service-838894765790.us-central1.run.app",y=k((()=>localStorage.getItem("appLang")||"en")());c.value=y.value,Le(y,o=>{c.value=o,localStorage.setItem("appLang",o)});const r=k({id:null,email:"",phone:"",location:"",map_link:"",privacy_policy_en:"",privacy_policy_ar:"",terms_and_conditions_en:"",terms_and_conditions_ar:"",media:[]}),X=G({get:()=>y.value==="ar"?r.value.privacy_policy_ar||"":r.value.privacy_policy_en||"",set:o=>y.value==="ar"?r.value.privacy_policy_ar=o:r.value.privacy_policy_en=o}),Z=G({get:()=>y.value==="ar"?r.value.terms_and_conditions_ar||"":r.value.terms_and_conditions_en||"",set:o=>y.value==="ar"?r.value.terms_and_conditions_ar=o:r.value.terms_and_conditions_en=o}),a=Ve({email:"",phone:"",location:"",map_link:"",mainLogo:"",footerLogo:"",banners:""}),h=k({}),H=k(null),I=k(null),P=k(null),R=k(null),T=k(!1),O=k(!1),U=k(!1),C=k(!1),x=k([]),ee=G(()=>r.value.email.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.value.email)&&r.value.phone.trim()&&r.value.phone.length<=15&&r.value.location.trim()&&r.value.map_link.trim()&&!a.email&&!a.phone&&!a.location&&!a.map_link&&!a.mainLogo&&!a.footerLogo&&!a.banners),le=()=>{a.email=r.value.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.value.email)?"":t("validation.invalidEmail"):t("validation.emailRequired")},ne=()=>{a.phone=r.value.phone.trim()?r.value.phone.length>15?t("validation.phoneTooLong"):"":t("validation.phoneRequired")},A=()=>{le(),ne(),a.location=r.value.location.trim()?"":t("validation.locationRequired"),a.banners=x.value.length>0?"":t("validation.atLeastOneBanner")},N=o=>n=>{n.preventDefault(),o==="main"?T.value=!0:o==="footer"?O.value=!0:o==="banners"&&(U.value=!0)},M=o=>()=>{o==="main"?T.value=!1:o==="footer"?O.value=!1:o==="banners"&&(U.value=!1)},Q=(o,n)=>o.type.match("image.*")?o.size>2*1024*1024?(a[n]=t("settings.imageTooLarge"),q.add({severity:"error",summary:t("error"),detail:t("settings.imageTooLarge"),life:3e3}),!1):!0:(a[n]=t("settings.invalidImageType"),q.add({severity:"error",summary:t("error"),detail:t("settings.invalidImageType"),life:3e3}),!1),E=(o,n)=>{var v,b,S;const u=((v=o.target.files)==null?void 0:v[0])||((S=(b=o.dataTransfer)==null?void 0:b.files)==null?void 0:S[0]);if(!(!u||!Q(u,n==="main"?"mainLogo":"footerLogo")))if(n==="main"){H.value=u;const g=new FileReader;g.onload=j=>P.value=j.target.result,g.readAsDataURL(u),T.value=!1,a.mainLogo=""}else{I.value=u;const g=new FileReader;g.onload=j=>R.value=j.target.result,g.readAsDataURL(u),O.value=!1,a.footerLogo=""}},te=o=>{o==="main"?(H.value=null,P.value=null,a.mainLogo=""):(I.value=null,R.value=null,a.footerLogo="")},K=o=>{var u;const n=o.target.files||((u=o.dataTransfer)==null?void 0:u.files);n!=null&&n.length&&(Array.from(n).forEach(p=>{if(Q(p,"banners")){const v=new FileReader;v.onload=b=>{x.value.push({preview:b.target.result,file:p})},v.readAsDataURL(p)}}),U.value=!1,a.banners="")},me=o=>{x.value.splice(o,1),A()},be=(o,n)=>{var v;const u=(v=o.target.files)==null?void 0:v[0];if(!u||!Q(u,"banners"))return;const p=new FileReader;p.onload=b=>{x.value[n]={...x.value[n],preview:b.target.result,file:u}},p.readAsDataURL(u)},fe=async()=>{var n,u,p,v;if(C.value)return;if(C.value=!0,A(),!ee.value){q.add({severity:"error",summary:t("validation.error"),detail:t("validation.fillRequired"),life:3e3}),C.value=!1;return}const o=new FormData;H.value&&o.append("main_logo",H.value),I.value&&o.append("footer_logo",I.value),x.value.forEach(b=>b.file&&o.append("banners[]",b.file)),o.append("email",r.value.email),o.append("phone",r.value.phone),o.append("location",r.value.location),o.append("link",r.value.map_link),o.append("privacy_policy_en",r.value.privacy_policy_en),o.append("privacy_policy_ar",r.value.privacy_policy_ar),o.append("terms_and_conditions_en",r.value.terms_and_conditions_en),o.append("terms_and_conditions_ar",r.value.terms_and_conditions_ar);try{await ce.post(`${w}/api/setting`,o,{headers:{"Content-Type":"multipart/form-data"}}),q.add({severity:"success",summary:t("success"),detail:t("settings.updated"),life:3e3})}catch(b){h.value=((u=(n=b.response)==null?void 0:n.data)==null?void 0:u.errors)||{},q.add({severity:"error",summary:t("error"),detail:((v=(p=b.response)==null?void 0:p.data)==null?void 0:v.message)||t("error.updateSettings"),life:3e3}),console.error(b)}finally{C.value=!1}};return Se(async()=>{var o,n;try{const{data:u}=await ce.get(`${w}/api/setting`),p=u.data;r.value={id:p.id,email:p.email??"",phone:p.phone??"",location:p.location??"",map_link:p.link??p.map_link??"",privacy_policy_en:p.privacy_policy_en??"",privacy_policy_ar:p.privacy_policy_ar??"",terms_and_conditions_en:p.terms_and_conditions_en??"",terms_and_conditions_ar:p.terms_and_conditions_ar??"",media:p.media??[]};const v=p.media.find(g=>g.name==="main_logo");v&&(P.value=v.url);const b=p.media.find(g=>g.name==="footer_logo");b&&(R.value=b.url);const S=p.media.filter(g=>g.name==="banner"||g.name==="banners");x.value=S.map(g=>({id:g.id,preview:g.url,file:null})),A()}catch(u){q.add({severity:"error",summary:t("error"),detail:((n=(o=u.response)==null?void 0:o.data)==null?void 0:n.message)||t("error.loadSettings"),life:3e3}),console.error(u)}}),(o,n)=>{const u=De("va-card");return m(),Ce(u,{class:"card"},{default:Ee(()=>{var p,v,b,S,g,j,oe,ie,re,ae,se,de;return[e("div",Ke,[e("form",{onSubmit:_(fe,["prevent"]),class:"flex flex-col w-3/4 py-9"},[e("h2",Ye,s(o.$t("settings.updateSettings")),1),e("div",Ge,[e("label",Je,s(o.$t("settings.email")),1),L(V(F),{id:"email",modelValue:r.value.email,"onUpdate:modelValue":n[0]||(n[0]=i=>r.value.email=i),type:"email",required:"","aria-required":"true",class:D(["mt-2 w-full border rounded p-2",{"border-red-500":a.email}]),onInput:le},null,8,["modelValue","class"]),a.email||(p=h.value)!=null&&p.email?(m(),f("div",We,s(a.email||((v=h.value.email)==null?void 0:v[0])),1)):$("",!0)]),e("div",Xe,[e("label",Ze,s(o.$t("settings.phone")),1),L(V(F),{id:"phone",modelValue:r.value.phone,"onUpdate:modelValue":n[1]||(n[1]=i=>r.value.phone=i),type:"text",required:"","aria-required":"true",class:D(["mt-2 w-full border rounded p-2",{"border-red-500":a.phone}]),onInput:ne},null,8,["modelValue","class"]),a.phone||(b=h.value)!=null&&b.phone?(m(),f("div",el,s(a.phone||((S=h.value.phone)==null?void 0:S[0])),1)):$("",!0)]),e("div",ll,[e("label",nl,s(o.$t("settings.location")),1),L(V(F),{id:"location",modelValue:r.value.location,"onUpdate:modelValue":n[2]||(n[2]=i=>r.value.location=i),type:"text",required:"","aria-required":"true",class:D(["mt-2 w-full border rounded p-2",{"border-red-500":a.location}])},null,8,["modelValue","class"]),a.location||(g=h.value)!=null&&g.location?(m(),f("div",tl,s(a.location||((j=h.value.location)==null?void 0:j[0])),1)):$("",!0)]),e("div",ol,[e("label",il,s(o.$t("settings.mapLink")),1),L(V(F),{id:"map_link",modelValue:r.value.map_link,"onUpdate:modelValue":n[3]||(n[3]=i=>r.value.map_link=i),type:"url",placeholder:"https://maps.google.com/...",class:D(["mt-2 w-full border rounded p-2",{"border-red-500":a.map_link}])},null,8,["modelValue","class"]),e("p",rl,s(o.$t("settings.mapLinkHint")),1),a.map_link||(oe=h.value)!=null&&oe.map_link?(m(),f("div",al,s(a.map_link||((ie=h.value.map_link)==null?void 0:ie[0])),1)):$("",!0)]),e("div",sl,[e("label",dl,s(o.$t("settings.privacyPolicy")),1),L(V(W),{id:"privacy_policy",modelValue:X.value,"onUpdate:modelValue":n[4]||(n[4]=i=>X.value=i),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(re=h.value)!=null&&re.privacy_policy?(m(),f("div",ql,s((ae=h.value.privacy_policy)==null?void 0:ae[0]),1)):$("",!0)]),e("div",cl,[e("label",pl,s(o.$t("settings.termsConditions")),1),L(V(W),{id:"terms_and_conditions",modelValue:Z.value,"onUpdate:modelValue":n[5]||(n[5]=i=>Z.value=i),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(se=h.value)!=null&&se.terms_and_conditions?(m(),f("div",ul,s((de=h.value.terms_and_conditions)==null?void 0:de[0]),1)):$("",!0)]),e("div",ml,[e("label",bl,s(o.$t("settings.mainLogo")),1),e("div",fl,[e("label",{onDragover:n[9]||(n[9]=_(i=>N("main"),["prevent"])),onDragleave:n[10]||(n[10]=i=>M("main")),onDrop:n[11]||(n[11]=_(i=>E(i,"main"),["prevent"])),class:D([{"border-blue-500 bg-blue-50":T.value,"border-gray-300":!T.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:n[6]||(n[6]=i=>E(i,"main")),accept:"image/*",class:"hidden","aria-label":"Upload main logo",id:"main-logo-upload"},null,32),P.value?(m(),f("div",gl,[e("div",vl,[e("img",{src:P.value,alt:"Main Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,hl),e("div",kl,[e("div",wl,[e("button",{type:"button",onClick:n[7]||(n[7]=_(i=>te("main"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[23]||(n[23]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",yl,[n[24]||(n[24]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:n[8]||(n[8]=i=>E(i,"main")),accept:"image/*",class:"hidden","aria-label":"Replace main logo"},null,32)])])])]),e("p",xl,s(o.$t("settings.changeLogo")),1)])):(m(),f("div",_l,[n[25]||(n[25]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",$l,[e("span",zl,s(o.$t("settings.upload")),1),J(" "+s(o.$t("settings.orDragDrop")),1)]),e("p",Ll,s(o.$t("settings.fileTypes")),1)]))],34)]),a.mainLogo?(m(),f("div",Vl,s(a.mainLogo),1)):$("",!0)]),e("div",Sl,[e("label",Dl,s(o.$t("settings.footerLogo")),1),e("div",Cl,[e("label",{onDragover:n[15]||(n[15]=_(i=>N("footer"),["prevent"])),onDragleave:n[16]||(n[16]=i=>M("footer")),onDrop:n[17]||(n[17]=_(i=>E(i,"footer"),["prevent"])),class:D([{"border-blue-500 bg-blue-50":O.value,"border-gray-300":!O.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:n[12]||(n[12]=i=>E(i,"footer")),accept:"image/*",class:"hidden","aria-label":"Upload footer logo",id:"footer-logo-upload"},null,32),R.value?(m(),f("div",El,[e("div",jl,[e("img",{src:R.value,alt:"Footer Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,Pl),e("div",Rl,[e("div",Tl,[e("button",{type:"button",onClick:n[13]||(n[13]=_(i=>te("footer"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[26]||(n[26]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",Ol,[n[27]||(n[27]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:n[14]||(n[14]=i=>E(i,"footer")),accept:"image/*",class:"hidden","aria-label":"Replace footer logo"},null,32)])])])]),e("p",Ul,s(o.$t("settings.changeLogo")),1)])):(m(),f("div",Bl,[n[28]||(n[28]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",Hl,[e("span",Il,s(o.$t("settings.upload")),1),J(" "+s(o.$t("settings.orDragDrop")),1)]),e("p",Fl,s(o.$t("settings.fileTypes")),1)]))],34)]),a.footerLogo?(m(),f("div",Al,s(a.footerLogo),1)):$("",!0)]),e("div",Nl,[e("label",Ml,s(o.$t("settings.banners"))+" ("+s(x.value.length)+") ",1),e("div",Ql,[e("label",{onDragover:n[20]||(n[20]=_(i=>N("banners"),["prevent"])),onDragleave:n[21]||(n[21]=i=>M("banners")),onDrop:n[22]||(n[22]=_(i=>K(i),["prevent"])),class:D([{"border-blue-500 bg-blue-50":U.value,"border-gray-300":!U.value},"cursor-pointer w-full max-w-4xl rounded-xl border-2 border-dashed transition duration-300 p-6"])},[e("input",{type:"file",multiple:"",onChange:n[18]||(n[18]=i=>K(i)),accept:"image/*",class:"hidden",id:"banners-upload"},null,32),x.value.length===0?(m(),f("div",Kl,[n[29]||(n[29]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-images text-blue-500 text-3xl"})],-1)),e("p",Yl,[e("span",Gl,s(o.$t("settings.uploadBanners")),1),J(" "+s(o.$t("settings.orDragDrop")),1)]),e("p",Jl,s(o.$t("settings.fileTypes")),1)])):(m(),f("div",Wl,[(m(!0),f(je,null,Pe(x.value,(i,Y)=>(m(),f("div",{key:i.id??Y,class:"relative group"},[e("img",{src:i.preview,alt:"Banner preview",class:"w-full h-32 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,Xl),e("div",Zl,[e("div",en,[e("button",{type:"button",onClick:_(qe=>me(Y),["stop"]),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...n[30]||(n[30]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])],8,ln),e("label",nn,[n[31]||(n[31]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:qe=>be(qe,Y),accept:"image/*",class:"hidden"},null,40,tn)])])])]))),128)),e("label",on,[n[32]||(n[32]=e("i",{class:"pi pi-plus text-2xl text-gray-400 mb-1"},null,-1)),e("span",rn,s(o.$t("settings.addMore")),1),e("input",{type:"file",multiple:"",onChange:n[19]||(n[19]=i=>K(i)),accept:"image/*",class:"hidden"},null,32)])]))],34)]),a.banners?(m(),f("div",an,s(a.banners),1)):$("",!0)]),L(V(Re),{type:"submit",label:C.value?o.$t("settings.updating"):o.$t("settings.update"),class:"mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded p-2",disabled:C.value||!ee.value},null,8,["label","disabled"])],32)]),L(V(Te))]}),_:1})}}},qn=_e(sn,[["__scopeId","data-v-c2aea7d5"]]);export{qn as default};
