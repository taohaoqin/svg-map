function uuid () {
  return new Date().getTime().toString(16) + Math.random().toString(16).replace('0.', '')
}

export default {
  name: "BaseSvgMap",
  props: {
    // 是否可点击
    clickable: {
      type: Boolean,
      default: true
    },
    showCityName: {
      type: Boolean,
      default: true
    },
    activeStrokeColor: {
      // 区块选中边框色号
      type: String,
      default: "#96C8FF"
    },
    normalStrokeColor: {
      // 区块默认边框色号
      type: String,
      default: "#000"
    },
    activeFillColor: {
      // 区块选中填充色号
      type: String,
      default: "#6DD5FF"
    },
    activeFillColorOpacity: {
      // 区块选中填充色号透明度
      type: String,
      default: "0.5"
    },
    normalFillColor: {
      // 区块默认填充色号
      type: String,
      default: "transparent"
    }
  },
  data () {
    return {
      linearGradientId: uuid(),
      dataName: "",
      dataArea: "",
      viewSize: {},
      currentPath: null
    };
  },
  watch: {
    showSvg (val) {
      if (val) {
        this.$nextTick(() => {
          this.initSvg();
        });
      }
    },
    viewSize: {
      handler (val1, val2) {
        if (
          val1.innerWidth !== val2.innerWidth ||
          val1.innerHeight !== val2.innerHeight
        ) {
          this.initSvg();
        }
      },
      deep: true
    }
  },
  created () {
    setInterval(() => {
      this.viewSize = {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      };
    }, 1000);
  },
  methods: {
    // 初始化
    initSvg () {
      this.doc = this.$refs.svgContainer;
      this.doc.querySelector(".linearGradient")
        .setAttribute("id", this.linearGradientId);
      this.map = Array.from(this.doc.querySelectorAll(".path")).map(
        (item, index) => {
          let classNumber = document.querySelector(`.areaNumber${index}`);
          if (
            item.getAttribute("data-name") ==
            classNumber.getAttribute("data-area")
          ) {
            classNumber.style.textAlign = "center";
            classNumber.style.position = "absolute";
            classNumber.style.width = `${12 *
              (classNumber.getAttribute("data-num") + "").length}px`;
            classNumber.style.height = classNumber.style.width;
            classNumber.style.top =
              item.getBoundingClientRect().y +
              item.getBoundingClientRect().height / 8 +
              "px";
            classNumber.style.left =
              item.getBoundingClientRect().x +
              item.getBoundingClientRect().width / 2.7 -
              40 +
              "px";
          }
          let className = document.querySelector(`.areaName${index}`);
          if (item.getAttribute("data-name") == className.innerText) {
            className.style.width = `${58 * this.e}px`;
            className.style.height = `${20 * this.e}px`;
            className.style.fontSize = `${12 * this.e}px`;
            className.style.border = `${1 *
              this.e}px solid rgba(143,228,255,0.5)`;
            className.style.background = "rgba(0, 49, 97, 0.8)";
            className.style.textAlign = "center";
            className.style.position = "absolute";
            className.style.top =
              item.getBoundingClientRect().y +
              item.getBoundingClientRect().height / 8 +
              "px";
            className.style.left =
              item.getBoundingClientRect().x +
              item.getBoundingClientRect().width / 2.7 +
              "px";
          }
          return {
            name: item.getAttribute("data-name"),
            inde: item.getAttribute("data-index")
          };
        }
      );
      this.bindEvents(this.doc);
    },
    // 绑定事件
    bindEvents () {
      if (!this.clickable) return;
      // 添加点击事件
      const paths = this.doc.querySelectorAll(".path");
      Array.prototype.forEach.call(paths, item => {
        // 添加点击样式
        item.style.cursor = "pointer";
        item.onmouseover = e => this.handleMouseover(e);
        item.onmouseout = (e) => this.handleMouseout(e);
        item.onclick = e => this.handleClick(e);
      });

      const texts = this.doc.querySelectorAll(".text");
      Array.prototype.forEach.call(texts, item => {
        // 添加点击样式
        item.style.cursor = "pointer";
        item.onmouseover = e => this.handleMouseover(e);
        item.onmouseout = (e) => this.handleMouseout(e);
        item.onclick = e => this.handleClick(e);
      });
    },
    getDocument (el) {
      let doc = el.contentWindow || el.contentDocument;
      if (doc.document) {
        doc = doc.document;
      }
      return doc;
    },
    getPath (index) {
      return this.doc.querySelector(`#path-${index}`);
    },
    // 重置样式
    resetStyle () {
      if (!this.map) {
        return false;
      }
      Object.keys(this.map).forEach(k => {
        const path = this.getPath(k);
        if (path) {
          path.setAttribute("stroke-width", "0px");
          path.setAttribute("stroke", this.normalStrokeColor);
          path.setAttribute("fill", this.normalFillColor || "transparent");
        }
      });
      this.currentPath = null;
    },
    // 高亮样式
    highlightStyle (index) {
      this.resetStyle();
      const path = this.getPath(index);
      if (path) {
        path.setAttribute("fill-opacity", this.activeFillColorOpacity);
        path.setAttribute("fill", this.activeFillColor);
      }
      this.currentPath = path;
    },
    clearActive () {
      this.resetStyle();
    },
    // 外部选中
    select ({ name }) {
      if (!name || !this.clickable) return;
      if (!this.map) {
        setTimeout(() => {
          this.select({ name });
        }, 300);
        return false;
      }
      const index = Object.keys(this.map).findIndex(
        k => this.map[k].name === name
      );
      if (index) {
        this.highlightStyle(index);
      }
    },
    clearSelect () {
      this.resetStyle();
    },
    // 鼠标经过
    handleMouseover (e) {
      const index = e.target.getAttribute("data-index");
      if (!index) return;
      let className = document.querySelector(`.areaName${index}`);
      let areabox = document.querySelector(`.areabox${index}`);
      let { left, right } = className.getBoundingClientRect();
      if ((left + right) / 2 > window.innerWidth / 2) {
        areabox.style.right = "90px";
      } else {
        areabox.style.left = "190px";
      }
      areabox.style.display = "inline-block";
      className.style.background = "#00316";
      className.style.backgroundImage =
        "linear-gradient(0deg, rgba(15,183,236,0.00) 0%, #0FB7EC 99%)";
      this.areaNameList.forEach((item, index1) => {
        let className1 = document.querySelector(`.areaName${index1}`);
        if (item.text === name) {
          item.img = require("../img/1.png");
        } else {
          item.img = "";
          className1.style.background = "rgba(0, 49, 97, 0.8)";
        }
      });
      this.highlightStyle(index);
    },
    // 鼠标移出
    handleMouseout (e) {
      const index = e.target.getAttribute("data-index");
      if (!index) return;
      let className = document.querySelector(`.areaName${index}`);
      let areabox = document.querySelector(`.areabox${index}`);

      areabox.style.display = "none";

      className.style.background = "transparent";
      className.style.backgroundImage = "";
      this.areaNameList.forEach((item, index1) => {
        let className1 = document.querySelector(`.areaName${index1}`);
        item.img = "";
        className1.style.background = "rgba(0, 49, 97, 0.8)";
      });
      this.highlightStyle(index);
      this.resetStyle();
    },
    // 点击选中
    handleClick (e) {
      const index = e.target.getAttribute("data-index");
      const path = this.getPath(index);
      // 派发数据
      this.dataName = path.getAttribute("data-name");
      this.dataArea = path.getAttribute("data-area");

      // this.leftMapShow = true;
      // this.$emit("clickSvgShow", false);
    }
  }
};

