
export default {
    bind: (el) => {
        el.resizeEventHandler = () => el.echartsInstance.resize();

        if ( window.attachEvent ) {
            window.attachEvent('onresize', el.resizeEventHandler);
        } else {
            window.addEventListener('resize', el.resizeEventHandler, false);
        }
    },

    inserted: (el, binding) => {
        el.echartsInstance = echarts.init(el);
        el.echartsInstance.setOption(binding.value);
    },

    update: (el, binding) => {
        el.echartsInstance.setOption(binding.value);
    },

    unbind: (el) => {
        if ( window.attachEvent ) {
            window.detachEvent('onresize', el.resizeEventHandler);
        } else {
            window.removeEventListener('resize', el.resizeEventHandler, false);
        }

        el.echartsInstance.dispose();
    }
}

