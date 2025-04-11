import {html, css} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {isSmallScreen} from './helpers.js';

export const paginationStyle = css`
	.pagination-box{text-align:center;padding:10px 5px;}
	.pagination{display: inline-block;}
    .pagination-box[disabled]{display:none}
	.pagination a{
		color: var(--k-pagination-color);
		float: left;
		padding: 8px 16px;
		text-decoration: none;
		transition: background-color .3s;
		border: 1px solid #555;
		border-color:var(--k-pagination-border-color, var(--k-btn-border-color, #555));
		margin:var(--flow-pagination-margin, 2px 4px);
        cursor:pointer;
        user-select:none;
	}
	@media (max-width:768px){
		.pagination a{
			padding:8px 6px;
			margin: 0px 2px;
			font-size:0.8rem;
		}
	}
	.pagination a.disabled{
		opacity:0.5;
	}
	.pagination a.hidden{display:none}
	.pagination a.active{
		background:var(--k-pagination-active-bg, #2489da);
		color:var(--k-pagination-active-color, #FFF);
		border:1px solid #2489da;
		border-color:var(--k-pagination-active-border-color, #2489da);
	}
	.pagination a.active,
	.pagination a.disabled{
		cursor:default;
	}
	.pagination a:hover:not(.active):not(.disabled){
        border-color:var(--k-pagination-hover-border-color, var(--k-btn-hover-border-color, #777 ));
		background-color:var(--k-pagination-hover-bg-color, var(--k-btn-hover-bg-color, rgba(255,255,255, 0.2) ));
		color:var(--k-pagination-hover-color, var(--k-btn-hover-color, inherit));
	}
`;


export const buildPagination = (total, skip=0, limit=25)=>{
    skip = +skip;
    limit = +limit;
    total = +total;

    let totalPages = Math.ceil(total/limit);
    let activePage = Math.min(Math.ceil((skip+1)/limit), totalPages);
    let maxPages = Math.min(isSmallScreen?3:10, totalPages);
    let half = Math.floor(maxPages/2);
    let prev = Math.max(activePage-1, 1);
    let next = Math.min(activePage+1, totalPages)
    let p = 1;
    if(activePage-half > 1)
        p = activePage-maxPages+Math.min(totalPages-activePage, half)+1;

    let pages = [];
    for(let i=0; i<maxPages; i++){
        pages.push({
            p,
            skip:(p-1)*limit,
            active:activePage==p,
        })
        p++;
    }
    return {
        totalPages,
        activePage,
        isLast:activePage==totalPages,
        isFirst:activePage==1,
        prev,
        next,
        last:totalPages,
        lastSkip:(totalPages-1)*limit,
        prevSkip:(prev-1) * limit,
        nextSkip:(next-1) * limit,
        total,
        skip,
        limit,
        pages,
        maxPages,
        half
    }
}

export const renderPagination = (pagination, clickHandler, options={})=>{
    if(!pagination)
        pagination = {pages:[], isFirst:true, isLast:true, totalPages:0, type:''};
    let {pages, isFirst, isLast, prevSkip, nextSkip, totalPages, lastSkip, type} = pagination;

    let hideNextPrev = pages.length ==0?' hidden':'';
    let FIRST = options.first||'FIRST';
    let LAST = options.last||'LAST';
    let PREV = options.prev||'<';
    let NEXT = options.next||'>';
    clickHandler = clickHandler || (e=>{});
    return html`
    <div class="pagination-box" ?disabled="${!pages.length}" @click=${clickHandler}>
        <div class="pagination" data-pagination="${type}">
            <a class="first ${(isFirst?'disabled':'')+hideNextPrev}" data-skip="0">${FIRST}</a>
            <a class="prev ${(isFirst?'disabled':'')+hideNextPrev}" data-skip="${prevSkip}">${PREV}</a>
            ${repeat(pages, p=>p.p, p=>html`
                <a class="${p.active?'active':''}" data-skip="${p.skip}">${p.p}</a>
            `)}
            <a class="next ${(isLast?'disabled':'')+hideNextPrev}"  data-skip="${nextSkip}">${NEXT}</a>
            <a class="first ${(isLast?'disabled':'')+hideNextPrev}" data-skip="${lastSkip}">${LAST}</a>
        </div>
    </div>`;
}

export const loadingMaskStyle = css`
    .mask{
        position:absolute;
        left:0px;
        top:0px;
        right:0px;
        bottom:0px;
        width:100%;
        height:100%;
        opacity:1;
        z-index:1000;
        background-color:rgba(0, 0, 0, 0.7);
        background-color:var(--flow-loading-mask-bg-color, rgba(0, 0, 0, 0.7));
        animation: fade-out 1s ease forwards;
    }
    .mask .loading-logo{
        width: 100px;
        height: 100px;
        position: relative;
        left: 50%;
        top: 50%;
        margin: -50px 0 0 -50px;
    }

    :host(.loading) .mask,
    .loading .mask{
        animation-name: fade-in;
    }
    :host(:not(.loading)) .mask .loading-logo .animate{
        fill:#009688;
    }
    @keyframes fade-in{
        0% {z-index:-1; opacity:0}
        1% {z-index:1000; opacity:0}
        100% {z-index:1000; opacity:1}
    }
    @keyframes fade-out{
        0% {z-index:1000; opacity:1}
        99% {z-index:1000; opacity:0}
        100% {z-index:-1; opacity:0}
    }
`;