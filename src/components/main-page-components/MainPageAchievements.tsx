import React from "react";
import { Card, CardContent } from "../ui/card";

const MainPageAchievements = () => {
  return (
    <div>
      {" "}
      <section
        id="achievements"
        className=" bg-slate-200 w-full py-12 md:py-24 lg:py-32"
      >
        <div className="pl-2 pr-2 px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Başarılarımız
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2015
                </h3>
                <p className="text-gray-600">Tasarım Ödüllü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  FormulaG Güneş Arabaları Yarışı - 2014
                </h3>
                <p className="text-gray-600">Kurul Özel Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  FormulaG Güneş Arabaları Yarışı - 2014
                </h3>
                <p className="text-gray-600">Üçünülük Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2016
                </h3>
                <p className="text-gray-600">İkincilik Ödülü</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Tübitak Efficiency Challenge - 2016
                </h3>
                <p className="text-gray-600">
                  Communication Award - En İyi Sunum Ödülü
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPageAchievements;
