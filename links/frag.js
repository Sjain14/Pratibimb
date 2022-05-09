//noprotect
const frag = `
	precision highp float;

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	// uniform vec3 u_lightDir;
	// uniform vec3 u_col;
	// uniform mat3 uNormalMatrix;
	// uniform float u_pixelDensity;
	uniform sampler2D u_tex;

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	uniform vec3 particles[${MAX_PARTICLE_COUNT}];

	uniform vec3 colors[${MAX_PARTICLE_COUNT}];
	uniform sampler2D tex0;
	${frag_functions_default}

	void main(){
		vec2 st = var_vertTexCoord.xy /u_resolution.xy;
		// st.y = 1.0 - st.y;
		vec3 color = vec3(0.);

		float mouseD = distance(st,u_mouse);
		st+= vec2(cnoise(vec3(st*9000.,u_time/50.)),
						  cnoise(vec3(st*9000.,u_time/50.+5000.)))/250.;
		st+= vec2(cnoise(vec3(st*900.,u_time/50.)),
						  cnoise(vec3(st*900.,u_time/50.+5000.)))/250.;
		st+= vec2(cnoise(vec3(st*(90.+mouseD*1.),u_time/50.)),
						  cnoise(vec3(st*(90.+mouseD*1.),u_time/50.+5000.)))/100.;
		
		
		float dd =0.;
		for(int i=0;i<${MAX_PARTICLE_COUNT};i++){
			vec3 p = particles[i];
			vec3 pColor = colors[i];
			float d = distance(st,p.xy);
			float dsq = pow(d,2.);
			dd+=5./dsq;
			vec3 resultColor =( smoothstep(p.z/50.,0.0,dsq)/200.
							+ smoothstep(p.z/10000.,0.0,dsq)/2.)*pColor;
			color+=resultColor;
			// color*=resultColor/2.;
		}
		// color*=(sin(dd/500.)+1.)/2.;
		color*=1.+(sin(dd/500.)+1.)/2.;
		vec4 tex = texture2D(tex0,st);

		color*=1.+ cnoise(vec3(st*9000.,u_time))*0.1;
		color+=tex.rgb*0.9;
		color += color*color/200.;
		// color = color;
		gl_FragColor= vec4(color,1.0);
	}
`



