import { Info, Target, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations("AboutPage");
    return (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{t("title")}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="text-center">
                            <div className="flex justify-center">
                                <Info className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("whoWeAreTitle")}</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                {t("whoWeAreDesc")}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <Target className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("ourMissionTitle")}</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                {t("ourMissionDesc")}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="flex justify-center">
                                <ShieldCheck className="h-12 w-12 text-indigo-600" />
                            </div>
                            <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">{t("integrityTitle")}</h3>
                            <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">
                                {t("integrityDesc")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 p-8 sm:p-12">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <h2 className="text-3xl font-bold tracking-tight text-indigo-900 dark:text-indigo-100">{t("readyToShopTitle")}</h2>
                            <p className="mt-4 text-lg text-indigo-700 dark:text-indigo-300">
                                {t("readyToShopSubtitle")}
                            </p>
                        </div>
                        <div className="mt-10 flex items-center lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                            <a
                                href="/products"
                                className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
                            >
                                {t("browseCollections")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
