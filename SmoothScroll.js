class SmoothScroll {
  constructor(_containerSelector, _params) {

    // Init DOM elements
    this.$ = {
      container: document.querySelector(_containerSelector),
      containerBody: document.querySelector(_containerSelector + '__body'),
      hitbox: document.querySelector(_containerSelector + '--hitbox'),
      controlsDuration: document.querySelector('.controls input[type=range]'),
      controlsEasing: document.querySelectorAll('.controls__radio'),
      controlsEasingRadio: document.querySelectorAll('.controls input[type=radio]'),
      duration: document.querySelector('.controls__duration'),
    }

    console.log(this.$.controlsEasing)

    // Init params
    this.params = {
      containerHeight: this.$.containerBody.offsetHeight,
      duration: _params.duration,
      timingFunction: _params.timingFunction,
    }

    // Launch init functions
    document.addEventListener('DOMContentLoaded', () => { 
      this._initStyle()
      this._initListeners()
    })
  }

  _initStyle() {

    const currentScrollY = window.scrollY

    // Set container style
    this.$.container.style.overflow = `hidden`
    this.$.container.style.position = `fixed`
    this.$.container.style.height = `100vh`
    
    // Set containerBody style
    this.$.containerBody.style.transform = `translateY(${-window.scrollY}px)` // Scroll to current scroll
    
    // Add transtion after scroll to
    const addTransition = () => {
      // Set currentTranslateY
      const regex = /\s?([,])\s?/ 
      const splitTransform = getComputedStyle(this.$.containerBody).transform.split(regex)
      const currentTranslateY = parseInt(splitTransform[splitTransform.length-1])
      
      if(-currentTranslateY != currentScrollY) {
        setTimeout(() => {
          addTransition(currentTranslateY)
        }, 10);
      } else {
        // Add transition
        this.$.containerBody.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`
      }
    }

    // Run addTranstion
    addTransition()

    // Set hitbox style
    this.$.hitbox.style.height = `${this.params.containerHeight}px`

  }

  _initListeners() {

    window.addEventListener('scroll', (event) => { this._handleScroll(event) })
    window.addEventListener('resize', () => { this._handleResize() })

    // Listening mouseup on duration range
    this.$.controlsDuration.addEventListener('mouseup', () => { this._handleDuration() })

    // Listening mouseup on radio 
    for(let i = 0; i < this.$.controlsEasing.length; i++) {
      this.$.controlsEasing[i].addEventListener('mouseup', () => { this._handleEasing(this.$.controlsEasingRadio[i].value) })
    }
  }

  _handleScroll(_event) {

    this.$.containerBody.style.transform = `translateY(${-window.scrollY}px)`
  }

  _handleResize() {
    // Update usefull params
    this.params.containerHeight = this.$.containerBody.offsetHeight
    
    // Update usefull style
    this.$.hitbox.style.height = `${this.params.containerHeight}px`
  }

  _handleDuration() {
    // Update duration value
    this.$.duration.innerText = this.$.controlsDuration.value + 'ms'

    // Update duration variable
    this.params.duration = this.$.controlsDuration.value

    // Update duration
    this.$.containerBody.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`
  }

  _handleEasing(_value) {
    // Update timing function variable
    this.params.timingFunction = _value

    // Update duration
    this.$.containerBody.style.transition = `transform ${this.params.duration}ms ${this.params.timingFunction}`
  }
}

const params = {
  duration: 1000,
  timingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
}

new SmoothScroll('.container', params)