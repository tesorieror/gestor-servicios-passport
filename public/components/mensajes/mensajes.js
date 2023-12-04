const INFOS = 'INFOS';
const ERRS = 'ERRS';

class Mensajes {


	constructor() {
		this.clear();
	}

	clear() {
		sessionStorage.clear();
	}

	get infos() {
		let infosStr = sessionStorage.getItem(INFOS);
		if (!infosStr) {
			this.infos = [];
			infosStr = sessionStorage.getItem(INFOS);
		}
		return JSON.parse(infosStr);
	}

	set infos(infos) {
		if (!infos) sessionStorage.removeItem(INFOS);
		else sessionStorage.setItem(INFOS, JSON.stringify(infos));
	}

	get errs() {
		let errsStr = sessionStorage.getItem(ERRS);
		if (!errsStr) {
			this.errs = [];
			errsStr = sessionStorage.getItem(ERRS);
		}
		return JSON.parse(errsStr);
	}

	set errs(errs) {
		if (!errs) sessionStorage.removeItem(ERRS);
		else sessionStorage.setItem(ERRS, JSON.stringify(errs));
	}

	agregarInfo(info) {
		let infos = this.infos;
		infos.push(info);
		this.infos = infos;
	}

	agregarError(err) {
		let errs = this.errs;
		errs.push(err);
		this.errs = errs;
	}
}