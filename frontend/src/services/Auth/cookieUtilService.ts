const cookieDomain = [import.meta.env.VITE_DOMAIN as string];
export function setCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
  allowedDomains: string[] = cookieDomain
) {
  const isLocalhost =
    cookieDomain.includes("localhost") || cookieDomain.length === 0;

  if (isLocalhost) {
    // domain cant be set to localhost
    document.cookie = `${name}=${value}; path=/; Max-Age=${maxAgeSeconds}`;
  } else {
    for (const domain of allowedDomains) {
      document.cookie = `${name}=${value}; path=/; Max-Age=${maxAgeSeconds}; domain=${domain}`;
    }
  }
}
export function deleteCookie(
  name: string,
  path: string = "/",
  domains: string[] = cookieDomain
) {
  if (getCookie(name)) {
    domains.forEach((domain) => {
      document.cookie =
        name +
        "=; path=" +
        (path || "/") +
        "; domain=" +
        domain +
        "; Max-Age=-99999999;";
    });
  }
}

export function getCookie(name: string): string | null {
  const nameEQ = name.replace(/[-.+*]/g, "\\$&") + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
}
