import React from "react";
import { Star, Shield, Truck, Award, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Shield, label: "Гарантія якості", value: "10 років" },
    { icon: Star, label: "Категорій матрасів", value: "50+" },
    { icon: Truck, label: "Міст доставки", value: "Уся Україна" },
    { icon: Award, label: "Різні бренди", value: "20+" },
  ];

  const values = [
    {
      icon: Star,
      title: "Якість понад усе",
      description:
        "Ми співпрацюємо тільки з перевіреними виробниками та використовуємо найкращі матеріали для виготовлення матрасів.",
    },
    {
      icon: Heart,
      title: "Турбота про клієнтів",
      description:
        "Ваш комфорт та здоровий сон - наш пріоритет. Ми завжди готові допомогти у виборі ідеального матраса.",
    },
    {
      icon: Shield,
      title: "Надійність",
      description:
        "Всі наші товари мають офіційну гарантію та сертифікати якості від провідних виробників.",
    },
    {
      icon: Truck,
      title: "Надійна доставка",
      description:
        "Швидка та надійна доставка по всій Україні з можливістю відстеження.",
    },
  ];

  return (
    <div className="about">
      <div className="container">
        {/* Hero Section */}
        <section className="about__hero">
          <div className="about__hero-content">
            <h1 className="about__hero-title">Про нас</h1>
            <p className="about__hero-subtitle">
              MattressShop - це ваш надійний партнер у світі комфортного та
              здорового сну. Ми допомагаємо людям знайти ідеальний матрас для
              найкращого відпочинку.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="about__stats">
          <div className="about__stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="about__stat">
                <div className="about__stat-icon">
                  <stat.icon size={32} />
                </div>
                <div className="about__stat-value">{stat.value}</div>
                <div className="about__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="about__story">
          <div className="about__story-content">
            <h2 className="about__story-title">Наша історія</h2>
            <p className="about__story-text">
              MattressShop був створений з простою місією -
              допомогти людям краще спати. Ми починали як невелика команда
              ентузіастів, а тепер прагнемо стати провідним постачальником якісних матрасів в
              Україні.
            </p>
            <p className="about__story-text">
              Ми прагнемо здобути довіру кожного клієнта завдяки нашому
              індивідуальному підходу, високій якості продукції та чесному
              сервісу. Кожен матрас у нашому каталозі ретельно відібраний та
              перевірений нашою командою.
            </p>
            <p className="about__story-text">
              Ми постійно розвиваємося, вивчаємо новітні
              технології та розширюємо асортимент, але наші основні цінності
              залишаються незмінними - якість, надійність та турбота про кожного
              клієнта.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="about__values">
          <h2 className="about__values-title">Наші цінності</h2>
          <div className="about__values-grid">
            {values.map((value, index) => (
              <div key={index} className="about__value">
                <div className="about__value-icon">
                  <value.icon size={28} />
                </div>
                <h3 className="about__value-title">{value.title}</h3>
                <p className="about__value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="about__mission">
          <div className="about__mission-content">
            <h2 className="about__mission-title">Наша місія</h2>
            <p className="about__mission-text">
              Ми віримо, що якісний сон - це основа здорового та щасливого
              життя. Наша місія полягає в тому, щоб зробити комфортний та
              здоровий сон доступним для кожного українця.
            </p>
            <p className="about__mission-text">
              Ми прагнемо бути не просто магазином матрасів, а експертами, які
              допомагають нашим клієнтам зробити правильний вибір для їхнього
              здоров'я та комфорту.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="about__team">
          <h2 className="about__team-title">Чому обирають нас</h2>
          <div className="about__team-features">
            <div className="about__team-feature">
              <h3>Експертна консультація</h3>
              <p>
                Наші спеціалісти допоможуть підібрати матрас з урахуванням ваших
                індивідуальних потреб
              </p>
            </div>
            <div className="about__team-feature">
              <h3>Тестування перед покупкою</h3>
              <p>
                У нашому шоу-румі ви можете протестувати будь-який матрас перед
                покупкою
              </p>
            </div>
            <div className="about__team-feature">
              <h3>Гарантія якості</h3>
              <p>
                Всі матраси мають офіційну гарантію від виробника та можливість
                обміну
              </p>
            </div>
            <div className="about__team-feature">
              <h3>Сервіс після покупки</h3>
              <p>
                Ми підтримуємо зв'язок з клієнтами та надаємо поради щодо
                догляду за матрасом
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="about__cta">
          <div className="about__cta-content">
            <h2 className="about__cta-title">
              Готові знайти свій ідеальний матрас?
            </h2>
            <p className="about__cta-description">
              Переглянути наш каталог або відвідайте наш шоу-рум для
              персональної консультації
            </p>
            <div className="about__cta-actions">
              <a href="/catalog" className="btn btn-primary btn-lg">
                Переглянути каталог
              </a>
              <a href="/contacts" className="btn btn-outline btn-lg">
                Контакти
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
