import { NEW_SITE_PREFIX_URL, OLD_SITE_PREFIX_URL } from "app/config";

export const getRoutePath = ({
	pathMode = "Internal",
	newPath = "",
	oldPath = ""
}): string => {
	if (pathMode === "NewAdmin") return `/${NEW_SITE_PREFIX_URL}/${newPath}`;

	return `/${OLD_SITE_PREFIX_URL}/${oldPath}`;
};
