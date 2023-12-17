<template>
    <div class="container">
        <img class="icon" src="/icons/info.svg" alt="">

        <div class="tooltip-container">
            <p class="tooltip">
                <slot></slot>
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .tooltip-container {
        position: absolute;
        display: flex;
            
        opacity: 0;

        align-items: flex-end;

        justify-content: center;

        transform: translateY(-50%);
        bottom: 0.5rem;

        transition: 0.2s;

        z-index: 100;

        p {
            white-space: nowrap;
            width: 100%;
        }
    }

    .tooltip-container *, .tooltip-container {
        pointer-events: none; 
    }

    .container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tooltip {
        color: white;
        border: var(--contrast-color) solid 1px;
        background-color: var(--contrast-color);
        padding: 0.3rem 0.7rem;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 100;
    }
    
    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        border-width: 5px;
        border-style: solid;
        border-color: var(--contrast-color) transparent transparent transparent;

        transform: translateX(-50%);
    }

    .icon {
        position: relative;
        width: 0.9rem;
        height: 0.9rem;
        cursor: pointer;
        opacity: 0.5;
    }

    .icon:hover {
        opacity: 0.2;
    }

    .icon:hover + .tooltip-container  {
        opacity: 1;
    }
</style>