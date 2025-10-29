import{ae as vl,af as hl,ag as kl,ah as wl,o as m,c as f,k as e,a1 as yl,a2 as a,ai as xl,aj as _l,_ as zl,u as Ll,j as $l,r as y,g as F,W as Sl,w as Vl,d as Cl,B as sl,Z as Pl,s as dl,v as ql,C as L,t as q,z,l as j,m as x,H as U,y as k,q as cl,D as Dl,A as El}from"./index-d45c326e.js";import{x as jl,O as Ol}from"./index.es-c3e6217d.js";var Tl=`
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
`,Rl={root:"p-editor-container",toolbar:"p-editor-toolbar",formats:"ql-formats",header:"ql-header",font:"ql-font",bold:"ql-bold",italic:"ql-italic",underline:"ql-underline",color:"ql-color",background:"ql-background",list:"ql-list",select:"ql-align",link:"ql-link",image:"ql-image",codeBlock:"ql-code-block",clean:"ql-clean",content:"p-editor-content"},Fl=vl(Tl,{name:"editor",manual:!0}),Nl=Fl.load,Ul={name:"BaseEditor",extends:wl,props:{modelValue:String,placeholder:String,readonly:Boolean,formats:Array,editorStyle:null,modules:null},css:{classes:Rl,loadStyle:Nl},provide:function(){return{$parentInstance:this}}};function O(l){"@babel/helpers - typeof";return O=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},O(l)}function pl(l,n){var d=Object.keys(l);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(l);n&&(s=s.filter(function(v){return Object.getOwnPropertyDescriptor(l,v).enumerable})),d.push.apply(d,s)}return d}function Hl(l){for(var n=1;n<arguments.length;n++){var d=arguments[n]!=null?arguments[n]:{};n%2?pl(Object(d),!0).forEach(function(s){Il(l,s,d[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(d)):pl(Object(d)).forEach(function(s){Object.defineProperty(l,s,Object.getOwnPropertyDescriptor(d,s))})}return l}function Il(l,n,d){return n=Ml(n),n in l?Object.defineProperty(l,n,{value:d,enumerable:!0,configurable:!0,writable:!0}):l[n]=d,l}function Ml(l){var n=Al(l,"string");return O(n)==="symbol"?n:String(n)}function Al(l,n){if(O(l)!=="object"||l===null)return l;var d=l[Symbol.toPrimitive];if(d!==void 0){var s=d.call(l,n||"default");if(O(s)!=="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(l)}var ul=function(){try{return window.Quill}catch{return null}}(),H={name:"Editor",extends:Ul,emits:["update:modelValue","text-change","selection-change","load"],data:function(){return{reRenderColorKey:0}},quill:null,watch:{modelValue:function(n,d){n!==d&&this.quill&&!this.quill.hasFocus()&&(this.reRenderColorKey++,this.renderValue(n))}},mounted:function(){var n=this,d={modules:Hl({toolbar:this.$refs.toolbarElement},this.modules),readOnly:this.readonly,theme:"snow",formats:this.formats,placeholder:this.placeholder};ul?(this.quill=new ul(this.$refs.editorElement,d),this.initQuill(),this.handleLoad()):hl(()=>import("./quill-aea4ae4c.js").then(s=>s.q),["assets/quill-aea4ae4c.js","assets/index-d45c326e.js","assets/index-89fb3f4f.css"]).then(function(s){s&&kl.isExist(n.$refs.editorElement)&&(s.default?n.quill=new s.default(n.$refs.editorElement,d):n.quill=new s(n.$refs.editorElement,d),n.initQuill())}).then(function(){n.handleLoad()})},beforeUnmount:function(){this.quill=null},methods:{renderValue:function(n){this.quill&&(n?this.quill.setContents(this.quill.clipboard.convert(n)):this.quill.setText(""))},initQuill:function(){var n=this;this.renderValue(this.modelValue),this.quill.on("text-change",function(d,s,v){if(v==="user"){var _=n.$refs.editorElement.children[0].innerHTML,w=n.quill.getText().trim();_==="<p><br></p>"&&(_=""),n.$emit("update:modelValue",_),n.$emit("text-change",{htmlValue:_,textValue:w,delta:d,source:v,instance:n.quill})}}),this.quill.on("selection-change",function(d,s,v){var _=n.$refs.editorElement.children[0].innerHTML,w=n.quill.getText().trim();n.$emit("selection-change",{htmlValue:_,textValue:w,range:d,oldRange:s,source:v,instance:n.quill})})},handleLoad:function(){this.quill&&this.quill.getModule("toolbar")&&this.$emit("load",{instance:this.quill})}}};function Bl(l,n,d,s,v,_){return m(),f("div",a({class:l.cx("root")},l.ptm("root"),{"data-pc-name":"editor"}),[e("div",a({ref:"toolbarElement",class:l.cx("toolbar")},l.ptm("toolbar")),[yl(l.$slots,"toolbar",{},function(){return[e("span",a({class:l.cx("formats")},l.ptm("formats")),[e("select",a({class:l.cx("header"),defaultValue:"0"},l.ptm("header")),[e("option",a({value:"1"},l.ptm("option")),"Heading",16),e("option",a({value:"2"},l.ptm("option")),"Subheading",16),e("option",a({value:"0"},l.ptm("option")),"Normal",16)],16),e("select",a({class:l.cx("font")},l.ptm("font")),[e("option",xl(_l(l.ptm("option"))),null,16),e("option",a({value:"serif"},l.ptm("option")),null,16),e("option",a({value:"monospace"},l.ptm("option")),null,16)],16)],16),e("span",a({class:l.cx("formats")},l.ptm("formats")),[e("button",a({class:l.cx("bold"),type:"button"},l.ptm("bold")),null,16),e("button",a({class:l.cx("italic"),type:"button"},l.ptm("italic")),null,16),e("button",a({class:l.cx("underline"),type:"button"},l.ptm("underline")),null,16)],16),(m(),f("span",a({key:v.reRenderColorKey,class:l.cx("formats")},l.ptm("formats")),[e("select",a({class:l.cx("color")},l.ptm("color")),null,16),e("select",a({class:l.cx("background")},l.ptm("background")),null,16)],16)),e("span",a({class:l.cx("formats")},l.ptm("formats")),[e("button",a({class:l.cx("list"),value:"ordered",type:"button"},l.ptm("list")),null,16),e("button",a({class:l.cx("list"),value:"bullet",type:"button"},l.ptm("list")),null,16),e("select",a({class:l.cx("select")},l.ptm("select")),[e("option",a({defaultValue:""},l.ptm("option")),null,16),e("option",a({value:"center"},l.ptm("option")),null,16),e("option",a({value:"right"},l.ptm("option")),null,16),e("option",a({value:"justify"},l.ptm("option")),null,16)],16)],16),e("span",a({class:l.cx("formats")},l.ptm("formats")),[e("button",a({class:l.cx("link"),type:"button"},l.ptm("link")),null,16),e("button",a({class:l.cx("image"),type:"button"},l.ptm("image")),null,16),e("button",a({class:l.cx("codeBlock"),type:"button"},l.ptm("codeBlock")),null,16)],16),e("span",a({class:l.cx("formats")},l.ptm("formats")),[e("button",a({class:l.cx("clean"),type:"button"},l.ptm("clean")),null,16)],16)]})],16),e("div",a({ref:"editorElement",class:l.cx("content"),style:l.editorStyle},l.ptm("content")),null,16)],16)}H.render=Bl;const Ql={class:"flex justify-center"},Kl={class:"pb-4 text-center va-text-bold"},Gl={class:"mb-4"},Jl={for:"email",class:"block text-sm font-medium text-gray-700"},Yl={key:0,class:"mt-1 text-red-500 text-sm"},Wl={class:"mb-4"},Zl={for:"phone",class:"block text-sm font-medium text-gray-700"},Xl={key:0,class:"mt-1 text-red-500 text-sm"},le={class:"mb-4"},ee={for:"location",class:"block text-sm font-medium text-gray-700"},ne={key:0,class:"mt-1 text-red-500 text-sm"},te={class:"mb-4"},oe={class:"block text-sm font-medium text-gray-700 mb-2"},ie={class:"mt-2 text-sm text-gray-600"},re={key:0,class:"mt-1 text-red-500 text-sm"},ae={key:0},se={key:1},de={class:"mb-4"},qe={class:"block text-sm font-medium text-gray-700"},ce={key:0,class:"mt-1 text-red-500 text-sm"},pe={class:"mb-4"},ue={class:"block text-sm font-medium text-gray-700"},me={key:0,class:"mt-1 text-red-500 text-sm"},be={class:"mb-4"},fe={class:"block text-sm font-medium text-gray-700"},ge={class:"flex justify-center mt-2"},ve={key:0,class:"p-4"},he={class:"relative group"},ke=["src"],we={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},ye={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},xe={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},_e={class:"mt-2 text-center text-sm text-gray-500"},ze={key:1,class:"p-8 flex flex-col items-center justify-center"},Le={class:"text-sm text-center text-gray-600 mb-1"},$e={class:"text-blue-500 font-medium"},Se={class:"text-xs text-gray-400"},Ve={key:0,class:"mt-1 text-red-500 text-sm"},Ce={class:"mb-4"},Pe={class:"block text-sm font-medium text-gray-700"},De={class:"flex justify-center mt-2"},Ee={key:0,class:"p-4"},je={class:"relative group"},Oe=["src"],Te={class:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 rounded-lg"},Re={class:"opacity-0 group-hover:opacity-100 space-x-3 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"},Fe={class:"bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"},Ne={class:"mt-2 text-center text-sm text-gray-500"},Ue={key:1,class:"p-8 flex flex-col items-center justify-center"},He={class:"text-sm text-center text-gray-600 mb-1"},Ie={class:"text-blue-500 font-medium"},Me={class:"text-xs text-gray-400"},Ae={key:0,class:"mt-1 text-red-500 text-sm"},Be={__name:"update",setup(l){const{t:n,locale:d}=Ll(),s=$l(),v={}.VITE_API_URL||"https://backend.pharmabank.sy",w=y((()=>localStorage.getItem("appLang")||"en")());d.value=w.value;const i=y({id:null,email:"",phone:"",location:"",lat:"",long:"",privacy_policy_en:"",privacy_policy_ar:"",terms_and_conditions_en:"",terms_and_conditions_ar:"",media:[]}),I=F({get:()=>w.value==="ar"?i.value.privacy_policy_ar||"":i.value.privacy_policy_en||"",set:t=>{w.value==="ar"?i.value.privacy_policy_ar=t:i.value.privacy_policy_en=t}}),M=F({get:()=>w.value==="ar"?i.value.terms_and_conditions_ar||"":i.value.terms_and_conditions_en||"",set:t=>{w.value==="ar"?i.value.terms_and_conditions_ar=t:i.value.terms_and_conditions_en=t}}),r=Sl({email:"",phone:"",location:"",lat:"",long:"",mainLogo:"",footerLogo:""}),b=y({}),T=y(null),R=y(null),C=y(null),P=y(null),D=y(!1),E=y(!1),$=y(!1),ml=F(()=>({lat:i.value.lat?parseFloat(i.value.lat):33.5138,lng:i.value.long?parseFloat(i.value.long):36.2765})),A=F(()=>i.value.email.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.email)&&i.value.phone.trim()&&i.value.phone.length<=15&&i.value.location.trim()&&!r.email&&!r.phone&&!r.location&&!r.lat&&!r.long&&!r.mainLogo&&!r.footerLogo);Vl(w,t=>{d.value=t,localStorage.setItem("appLang",t)});const B=()=>{i.value.email.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value.email)?r.email="":r.email=n("validation.invalidEmail"):r.email=n("validation.emailRequired")},Q=()=>{i.value.phone.trim()?i.value.phone.length>15?r.phone=n("validation.phoneTooLong"):r.phone="":r.phone=n("validation.phoneRequired")},N=()=>{B(),Q(),r.location=i.value.location.trim()?"":n("validation.locationRequired"),r.lat=i.value.lat&&!isNaN(parseFloat(i.value.lat))&&parseFloat(i.value.lat)>=-90&&parseFloat(i.value.lat)<=90?"":n("validation.invalidLat"),r.long=i.value.long&&!isNaN(parseFloat(i.value.long))&&parseFloat(i.value.long)>=-180&&parseFloat(i.value.long)<=180?"":n("validation.invalidLong")},bl=t=>{if(!t.latLng){s.add({severity:"error",summary:n("error"),detail:n("error.mapClick"),life:3e3});return}const o=t.latLng.lat(),u=t.latLng.lng();i.value.lat=o.toString(),i.value.long=u.toString(),N()},K=t=>o=>{o.preventDefault(),t==="main"?D.value=!0:t==="footer"&&(E.value=!0)},G=t=>()=>{t==="main"?D.value=!1:t==="footer"&&(E.value=!1)},fl=(t,o)=>{if(!t.type.match("image.*")){r[o==="main"?"mainLogo":"footerLogo"]=n("settings.invalidImageType"),s.add({severity:"error",summary:n("error"),detail:n("settings.invalidImageType"),life:3e3});return}if(t.size>2*1024*1024){r[o==="main"?"mainLogo":"footerLogo"]=n("settings.imageTooLarge"),s.add({severity:"error",summary:n("error"),detail:n("settings.imageTooLarge"),life:3e3});return}if(r[o==="main"?"mainLogo":"footerLogo"]="",o==="main"){T.value=t;const u=new FileReader;u.onload=p=>{C.value=p.target.result},u.readAsDataURL(t),D.value=!1}else if(o==="footer"){R.value=t;const u=new FileReader;u.onload=p=>{P.value=p.target.result},u.readAsDataURL(t),E.value=!1}},S=(t,o)=>{var p,h,g;const u=((p=t.target.files)==null?void 0:p[0])||((g=(h=t.dataTransfer)==null?void 0:h.files)==null?void 0:g[0]);u&&fl(u,o)},J=t=>{t==="main"?(T.value=null,C.value=null,r.mainLogo=""):t==="footer"&&(R.value=null,P.value=null,r.footerLogo="")},gl=async()=>{var o,u,p,h;if($.value)return;if($.value=!0,N(),!A.value){s.add({severity:"error",summary:n("validation.error"),detail:n("validation.fillRequired"),life:3e3}),$.value=!1;return}const t=new FormData;T.value&&t.append("main_logo",T.value),R.value&&t.append("footer_logo",R.value),t.append("email",i.value.email),t.append("phone",i.value.phone),t.append("location",i.value.location),t.append("lat",i.value.lat),t.append("long",i.value.long),t.append("privacy_policy_en",i.value.privacy_policy_en),t.append("privacy_policy_ar",i.value.privacy_policy_ar),t.append("terms_and_conditions_en",i.value.terms_and_conditions_en),t.append("terms_and_conditions_ar",i.value.terms_and_conditions_ar);try{const g=await sl.post(`${v}/api/setting`,t,{headers:{"Content-Type":"multipart/form-data"}});s.add({severity:"success",summary:n("success"),detail:n("settings.updated"),life:3e3})}catch(g){b.value=((u=(o=g.response)==null?void 0:o.data)==null?void 0:u.errors)||{},s.add({severity:"error",summary:n("error"),detail:((h=(p=g.response)==null?void 0:p.data)==null?void 0:h.message)||n("error.updateSettings"),life:3e3}),console.error(g)}finally{$.value=!1}};return Cl(async()=>{var t,o;try{const{data:u}=await sl.get(`${v}/api/setting`),p=u.data;i.value={id:p.id,email:p.email??"",phone:p.phone??"",location:p.location??"",lat:p.lat??"",long:p.long??"",privacy_policy_en:p.privacy_policy_en??"",privacy_policy_ar:p.privacy_policy_ar??"",terms_and_conditions_en:p.terms_and_conditions_en??"",terms_and_conditions_ar:p.terms_and_conditions_ar??"",media:p.media??[]};const h=i.value.media.find(V=>V.name==="main_logo");h&&(C.value=h.url);const g=i.value.media.find(V=>V.name==="footer_logo");g&&(P.value=g.url),N()}catch(u){s.add({severity:"error",summary:n("error"),detail:((o=(t=u.response)==null?void 0:t.data)==null?void 0:o.message)||n("error.loadSettings"),life:3e3}),console.error(u)}}),(t,o)=>{const u=Pl("va-card");return m(),dl(u,{class:"card"},{default:ql(()=>{var p,h,g,V,Y,W,Z,X,ll,el,nl,tl,ol,il,rl,al;return[e("div",Ql,[e("form",{onSubmit:L(gl,["prevent"]),class:"flex flex-col w-3/4 py-9"},[e("h2",Kl,q(t.$t("settings.updateSettings")),1),e("div",Gl,[e("label",Jl,q(t.$t("settings.email")),1),z(x(U),{id:"email",modelValue:i.value.email,"onUpdate:modelValue":o[0]||(o[0]=c=>i.value.email=c),type:"email",required:"","aria-required":"true",class:j(["mt-2 w-full border rounded p-2",{"border-red-500":r.email}]),onInput:B},null,8,["modelValue","class"]),r.email||(p=b.value)!=null&&p.email?(m(),f("div",Yl,q(r.email||((h=b.value.email)==null?void 0:h[0])),1)):k("",!0)]),e("div",Wl,[e("label",Zl,q(t.$t("settings.phone")),1),z(x(U),{id:"phone",modelValue:i.value.phone,"onUpdate:modelValue":o[1]||(o[1]=c=>i.value.phone=c),type:"text",required:"","aria-required":"true",class:j(["mt-2 w-full border rounded p-2",{"border-red-500":r.phone}]),onInput:Q},null,8,["modelValue","class"]),r.phone||(g=b.value)!=null&&g.phone?(m(),f("div",Xl,q(r.phone||((V=b.value.phone)==null?void 0:V[0])),1)):k("",!0)]),e("div",le,[e("label",ee,q(t.$t("settings.location")),1),z(x(U),{id:"location",modelValue:i.value.location,"onUpdate:modelValue":o[2]||(o[2]=c=>i.value.location=c),type:"text",required:"","aria-required":"true",class:j(["mt-2 w-full border rounded p-2",{"border-red-500":r.location}])},null,8,["modelValue","class"]),r.location||(Y=b.value)!=null&&Y.location?(m(),f("div",ne,q(r.location||((W=b.value.location)==null?void 0:W[0])),1)):k("",!0)]),e("div",te,[e("label",oe,q(t.$t("settings.mapLocation")),1),z(x(Ol),{style:{width:"100%",height:"400px","border-radius":"8px"},center:ml.value,zoom:10,onClick:bl,class:"rounded border shadow-md"},{default:ql(()=>[i.value.lat&&i.value.long?(m(),dl(x(jl),{key:0,options:{position:{lat:parseFloat(i.value.lat),lng:parseFloat(i.value.long)}}},null,8,["options"])):k("",!0)]),_:1},8,["center"]),e("div",ie,q(t.$t("settings.currentCoords"))+": "+q(i.value.lat||"Not set")+", "+q(i.value.long||"Not set"),1),r.lat||r.long||(Z=b.value)!=null&&Z.lat||(X=b.value)!=null&&X.long?(m(),f("div",re,[r.lat||(ll=b.value)!=null&&ll.lat?(m(),f("span",ae,q(r.lat||((el=b.value.lat)==null?void 0:el[0])),1)):k("",!0),r.long||(nl=b.value)!=null&&nl.long?(m(),f("span",se,q(r.long||((tl=b.value.long)==null?void 0:tl[0])),1)):k("",!0)])):k("",!0)]),e("div",de,[e("label",qe,q(t.$t("settings.privacyPolicy")),1),z(x(H),{id:"privacy_policy",modelValue:I.value,"onUpdate:modelValue":o[3]||(o[3]=c=>I.value=c),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(ol=b.value)!=null&&ol.privacy_policy?(m(),f("div",ce,q((il=b.value.privacy_policy)==null?void 0:il[0]),1)):k("",!0)]),e("div",pe,[e("label",ue,q(t.$t("settings.termsConditions")),1),z(x(H),{id:"terms_and_conditions",modelValue:M.value,"onUpdate:modelValue":o[4]||(o[4]=c=>M.value=c),editorStyle:"height: 200px",class:"my-2"},null,8,["modelValue"]),(rl=b.value)!=null&&rl.terms_and_conditions?(m(),f("div",me,q((al=b.value.terms_and_conditions)==null?void 0:al[0]),1)):k("",!0)]),e("div",be,[e("label",fe,q(t.$t("settings.mainLogo")),1),e("div",ge,[e("label",{onDragover:o[8]||(o[8]=L(c=>K("main"),["prevent"])),onDragleave:o[9]||(o[9]=c=>G("main")),onDrop:o[10]||(o[10]=L(c=>S(c,"main"),["prevent"])),class:j([{"border-blue-500 bg-blue-50":D.value,"border-gray-300":!D.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:o[5]||(o[5]=c=>S(c,"main")),accept:"image/*",class:"hidden","aria-label":"Upload main logo",id:"main-logo-upload"},null,32),C.value?(m(),f("div",ve,[e("div",he,[e("img",{src:C.value,alt:"Main Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,ke),e("div",we,[e("div",ye,[e("button",{type:"button",onClick:o[6]||(o[6]=L(c=>J("main"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...o[17]||(o[17]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",xe,[o[18]||(o[18]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:o[7]||(o[7]=c=>S(c,"main")),accept:"image/*",class:"hidden","aria-label":"Replace main logo"},null,32)])])])]),e("p",_e,q(t.$t("settings.changeLogo")),1)])):(m(),f("div",ze,[o[19]||(o[19]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",Le,[e("span",$e,q(t.$t("settings.upload")),1),cl(" "+q(t.$t("settings.orDragDrop")),1)]),e("p",Se,q(t.$t("settings.fileTypes")),1)]))],34)]),r.mainLogo?(m(),f("div",Ve,q(r.mainLogo),1)):k("",!0)]),e("div",Ce,[e("label",Pe,q(t.$t("settings.footerLogo")),1),e("div",De,[e("label",{onDragover:o[14]||(o[14]=L(c=>K("footer"),["prevent"])),onDragleave:o[15]||(o[15]=c=>G("footer")),onDrop:o[16]||(o[16]=L(c=>S(c,"footer"),["prevent"])),class:j([{"border-blue-500 bg-blue-50":E.value,"border-gray-300":!E.value},"cursor-pointer w-full max-w-md rounded-xl border-2 border-dashed transition duration-300"])},[e("input",{type:"file",onChange:o[11]||(o[11]=c=>S(c,"footer")),accept:"image/*",class:"hidden","aria-label":"Upload footer logo",id:"footer-logo-upload"},null,32),P.value?(m(),f("div",Ee,[e("div",je,[e("img",{src:P.value,alt:"Footer Logo Preview",class:"w-full max-h-64 object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"},null,8,Oe),e("div",Te,[e("div",Re,[e("button",{type:"button",onClick:o[12]||(o[12]=L(c=>J("footer"),["stop"])),class:"bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"},[...o[20]||(o[20]=[e("i",{class:"pi pi-trash text-sm"},null,-1)])]),e("label",Fe,[o[21]||(o[21]=e("i",{class:"pi pi-pencil text-sm"},null,-1)),e("input",{type:"file",onChange:o[13]||(o[13]=c=>S(c,"footer")),accept:"image/*",class:"hidden","aria-label":"Replace footer logo"},null,32)])])])]),e("p",Ne,q(t.$t("settings.changeLogo")),1)])):(m(),f("div",Ue,[o[22]||(o[22]=e("div",{class:"bg-blue-100 p-4 rounded-full mb-4"},[e("i",{class:"pi pi-image text-blue-500 text-2xl"})],-1)),e("p",He,[e("span",Ie,q(t.$t("settings.upload")),1),cl(" "+q(t.$t("settings.orDragDrop")),1)]),e("p",Me,q(t.$t("settings.fileTypes")),1)]))],34)]),r.footerLogo?(m(),f("div",Ae,q(r.footerLogo),1)):k("",!0)]),z(x(Dl),{type:"submit",label:$.value?t.$t("settings.updating"):t.$t("settings.update"),class:"mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded p-2",disabled:$.value||!A.value},null,8,["label","disabled"])],32)]),z(x(El))]}),_:1})}}},Ge=zl(Be,[["__scopeId","data-v-41f9279d"]]);export{Ge as default};
