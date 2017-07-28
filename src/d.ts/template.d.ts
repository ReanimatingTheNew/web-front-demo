declare module "template" {
    var mod: {
		(id: string, data: {}): string;
		render: (id: string, data: {}) => string;
		compile: (id: string, data: {}) => string;
		helper: (name: string, callback: () => void) => void;
	}
	export = mod;
}