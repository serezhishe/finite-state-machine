class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw Error('no config passed');
        this._config = config;
        this._state = config.initial;
        this._prevStates = [];
        this._canceledStates = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this._config.states[state]) throw Error('no such state in config');
        this._prevStates.push(this._state);
        this._state = state;
        this._canceledStates = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (!this._config.states[this._state].transitions[event]) throw Error('no such trigger');
        this._prevStates.push(this._state);
        this._state = this._config.states[this._state].transitions[event];
        this._canceledStates = [];
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._state = this._config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        if (!event) {
            for (let state in this._config.states) {
                result.push(state);
            }
        }
        for (let state in this._config.states) {
            if (this._config.states[state].transitions[event]) result.push(state);
        }
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._prevStates.length) {
            this._canceledStates.push(this._state);
            this._state = this._prevStates.pop();
            return true;
        } else return false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._canceledStates.length) {
            this._prevStates.push(this._state);
            this._state = this._canceledStates.pop();
            return true;
        } else return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._prevStates = [];
        this._canceledStates = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
